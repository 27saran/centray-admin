export const connectSSE = async (
  endpoint: string,
  token: string,
  onData: (data: unknown) => void,
  onError?: (error: Error) => void,
  onConnect?: () => void
) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const url = `${backendUrl}${endpoint}`;

    // SSE接続を開始
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok || !response.body) {
      throw new Error('SSE接続失敗');
    }

    // レスポンスからテキストストリームを作成
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    if (onConnect) {
      onConnect();
    }

    console.log('SSE接続確立. データ読み取り開始');

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      value.split('\n').forEach(line => {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data.trim()) {
            try {
              // JSONとしてパースしてコールバックに渡す
              const parsed = JSON.parse(data);
              onData(parsed);
            } catch (e) {
              console.error('SSE data parse error:', e);
              onData(data);
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('SSE connection error:', error);
    if (onError && error instanceof Error) {
      onError(error);
    }
  }
};