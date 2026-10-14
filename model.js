/* The complete fixed model. Rows follow VOCAB order. No hidden weights. */
export const VOCAB = Object.freeze(['the', 'cat', 'dog', 'runs', 'sleeps', '.']);
export const E = [[1,0],[0,1],[0,1],[-1,0],[-1,0],[0,-1]];
export const WQ = [[2,0],[0,2]];
export const WK = [[2,0],[0,2]];
export const WV = [[1,0],[0,1]];
export const WO = [[0,4,4,0,0,-4],[-4,0,0,4,4,0]];
export const MAX_TOKENS = 64;
export function parse(text) {
  const tokens = text.replace(/\./g, ' . ').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) throw new Error('Add at least one token to make a prediction.');
  if (tokens.length > MAX_TOKENS) throw new Error(`Use up to ${MAX_TOKENS} tokens in this playground.`);
  const invalid = [...new Set(tokens.filter(t => !VOCAB.includes(t)))];
  if (invalid.length) throw new Error(`Unknown token${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}. Use the, cat, dog, runs, sleeps, or a period, separated by spaces.`);
  return tokens;
}
export const transpose = A => A[0].map((_,j) => A.map(r=>r[j]));
export const matmul = (A,B) => A.map(row=>B[0].map((_,j)=>row.reduce((s,x,k)=>s+x*B[k][j],0)));
export function softmax(row) {
  const max = Math.max(...row);
  const exp = row.map(x=>Math.exp(x-max));
  const sum = exp.reduce((a,b)=>a+b,0);
  return exp.map(x=>x/sum);
}
export function evaluate(tokens) {
  if (!Array.isArray(tokens) || !tokens.length || tokens.length > MAX_TOKENS || tokens.some(t=>!VOCAB.includes(t))) throw new Error('Invalid model input.');
  const X = tokens.map(t=>[...E[VOCAB.indexOf(t)]]);
  const Q=matmul(X,WQ), K=matmul(X,WK), V=matmul(X,WV);
  const S=matmul(Q,transpose(K)).map(row=>row.map(x=>x/Math.sqrt(2)));
  const masked=S.map((row,i)=>row.map((x,j)=>j>i ? -Infinity:x));
  const A=masked.map(softmax);
  const H=matmul(A,V), h=H.at(-1);
  const z=matmul([h],WO)[0], p=softmax(z);
  return {tokens,X,Q,K,V,S,masked,A,H,h,z,p};
}

export function complete(tokens, maxNew=12) {
  let sequence=[...tokens], steps=[];
  evaluate(sequence); // Validate the initial prompt.
  for(let i=0;i<maxNew && sequence.length<MAX_TOKENS && sequence.at(-1)!=='.';i++){
    const r=evaluate(sequence),best=r.p.indexOf(Math.max(...r.p));
    steps.push({prompt:[...sequence],token:VOCAB[best],probability:r.p[best]});
    sequence.push(VOCAB[best]);
  }
  return {tokens:sequence,steps,finished:sequence.at(-1)==='.'};
}
