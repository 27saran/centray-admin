// リファクタ用。動かない
// const connectSSE = async (token: string) => {
//   const response = await fetch('/api/sse', {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Accept': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//     },
//   });

//   if (!response.body) {
//     throw new Error('ReadableStream not supported');
//   }

//   const reader = response.body
//     .pipeThrough(new TextDecoderStream())
//     .getReader();

//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) break;
//     const lines = value.split('\n');
//     for (const line of lines) {
//       if (line.startsWith('data: ')) {
//         const data = line.slice(6);
//         if (data.trim()) {
//           try {
//             const parsed = JSON.parse(data);
//             console.log(parsed);
//           } catch (e) {
//             console.log(data);
//           }
//         }
//       }
//     }
//   }
// };