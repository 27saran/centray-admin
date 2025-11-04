export const connectSSE = async (
  endpoint: string,
  token: string,
  onData: (data: unknown) => void,
  onError?: (error: Error) => void,
  onConnect?: () => void,
  signal?: AbortSignal // 切断用のシグナル
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
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('SSE接続失敗');
    }

    // レスポンスからテキストストリームを作成（ランタイムでのデータ変換処理）
    const reader = response.body
      .pipeThrough(new TextDecoderStream())  // バイナリ→テキストに変換
      .getReader();  // データを順次読み取る

    // onConnectを呼んだかどうかのフラグ（初回データ受信時に1度だけ呼ぶ）
    let hasCalledOnConnect = false;

    while (true) {
      // abortシグナルを検知したら中断する
      if (signal?.aborted) {
        reader.cancel();
        break;
      }

      const { value, done } = await reader.read();
      if (done) break;
      value.split('\n').forEach(line => {
        // SSE形式の「data: 」で始まる行をチェック
        if (line.startsWith('data: ')) {
          // 「data: 」プレフィックス（6文字）を削除してデータ部分を取得
          const data = line.slice(6);
          // 空でない場合のみ処理
          if (data.trim()) {
            try {
              // JSONとしてパースしてコールバックに渡す
              const parsed = JSON.parse(data);
              // 初回データ受信時のみ接続成功のコールバックを呼ぶ
              if (!hasCalledOnConnect && onConnect) {
                hasCalledOnConnect = true;
                onConnect();
              }

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
    // AbortErrorは正常な中断なのでエラー扱いしない
    if (error instanceof Error && error.name === 'AbortError') {
      return;
    }

    console.error('SSE connection error:', error);
    if (onError && error instanceof Error) {
      onError(error);
    }
  }
};