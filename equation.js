import {WQ,WK,WV,WO,VOCAB} from './model.js';

// These are the actual integer inputs/weights, not rounded intermediates.
function numericMatrix(rows,label) {
  return `<span class="equation-factor"><span class="equation-factor-label">${label}</span><span class="equation-matrix-scroll" tabindex="0" role="region" aria-label="${label}; ${rows.length} rows, ${rows[0].length} columns"><table class="equation-matrix" aria-label="${label}"><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x===-Infinity?'−∞':String(x).replace('-','−')}</td>`).join('')}</tr>`).join('')}</tbody></table></span></span>`;
}
const decimal=x=>Number(x.toFixed(8)).toString().replace('-','−');
export function renderPromptEquation(result) {
  const {X,tokens,z,p}=result,n=tokens.length;
  const mask=X.map((_,i)=>X.map((_,j)=>j<=i?0:-Infinity));
  const input=()=>numericMatrix(X,'input embeddings');
  return `<h3 id="prompt-equation-title">The full equation for your sequence</h3>
    <p class="prompt-equation-input"><b>x =</b> <span>${tokens.join(' ')}</span> <small>(${n} token${n===1?'':'s'})</small></p>
    <p class="small">Every input vector and fixed weight is substituted below. The mask is filled in for this exact prompt. Scroll across to follow the whole expression; tall or wide matrices scroll individually.</p>
    <div class="prompt-equation-scroll" tabindex="0" role="region" aria-label="Full equation with numeric matrices">
      <div class="prompt-equation-line">
        <span>F(x) = softmax( [ R(</span>
        <span class="numeric-fraction"><span class="numeric-numerator"><span>(</span>${input()}${numericMatrix(WQ,'query weights')}<span>)(</span>${input()}${numericMatrix(WK,'key weights')}<span>)<sup>ᵀ</sup></span></span><span class="numeric-denominator">√2</span></span>
        <span>+</span>${numericMatrix(mask,'causal mask')}<span>)</span>${input()}${numericMatrix(WV,'value weights')}<span>]<sub>${n}</sub></span>${numericMatrix(WO,'output weights')}<span>)</span>
      </div>
    </div>
    <p class="small prompt-equation-legend"><b>R</b> = softmax on each row. <b>ᵀ</b> = transpose. <b>[ · ]<sub>${n}</sub></b> = take row ${n}, the final input position. The formula above uses exact integer entries and the exact scale √2.</p>
    <div class="prompt-equation-result"><span class="eyebrow">EVALUATED FOR THIS PROMPT</span><p>F(x) ≈ softmax([${z.map(decimal).join(', ')}])</p><p>F(x) ≈ [${p.map(decimal).join(', ')}]</p><small>Probability order: ${VOCAB.map(t=>t==='.'?'period':t).join(', ')}. These decimal logits and probabilities are rounded to 8 places.</small></div>`;
}
