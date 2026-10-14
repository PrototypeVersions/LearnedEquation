# Learned Equation

An interactive field guide from six tokens to one exact attention-model equation.

**Live site:** https://PrototypeVersions.github.io/LearnedEquation/

A responsive, accessible, dependency-free static website. All calculations happen in the browser. No build step, external scripts, fonts, analytics, or API keys.

## Run locally

Serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000. ES modules require an HTTP server rather than opening index.html directly.

## Verify

With Node 18 or newer: `node --test tests/model.test.js`.

The tests compare all 9,330 sequences of lengths 1–5 against an independently written scalar equation, verify a hand-derived example, causal masking, normalization, input errors, the 64-token UI limit, and stability under extreme logits.

## Model contract

Vocabulary order: the, cat, dog, runs, sleeps, period. Embedding size 2; one causal attention head; no position encoding, residual, feed-forward network, biases, or normalization. All 36 scalar weights are explicitly specified in model.js and shown in the lesson. Weights are hand-set, not trained. Output is a next-token probability distribution. The weights favor article → noun → verb → period. "Complete the sentence" repeatedly evaluates the same equation and selects argmax, stopping at a predicted period, 12 generated tokens, or the 64-token input cap. No grammar filter is applied. Cat/dog share an embedding, as do runs/sleeps, so those pairs are deliberately indistinguishable to this toy. The parser also splits attached periods from words.

“Append top token” uses deterministic argmax with vocabulary-order tie breaking; it is separate from the model.

For input sequence x of length n, X = E(x):

`F(x) = softmax( [ rowSoftmax((X WQ)(X WK)^T / sqrt(2) + M) (X WV) ]_n WO )`

M[i,j] is zero for j <= i and negative infinity otherwise. Brackets with subscript n select the last row. Softmax subtracts the maximum for numerical stability. Model computations use JavaScript double precision; displayed numbers are rounded. The full downloadable JSON trace serializes masked negative infinities as the string "-Infinity".

Any nonempty sequence of the six tokens is mathematically valid. The UI caps prompts at 64 tokens to keep complete tables usable. Case is normalized, whitespace separates tokens, and repeated tokens are allowed. No position encoding means permutations preserving token counts and final token have identical final predictions (up to numerical rounding). This deliberate limitation is explained in the lesson alongside a smaller exact count-based description.

## GitHub Pages

Publish from branch **main**, folder **/ (root)** in Settings → Pages. The `.nojekyll` file bypasses Jekyll. All asset URLs are relative and work under the repository subpath. No workflow, package installation, or build is needed. See [GitHub's publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Reading

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): scaled dot-product attention and transformer structure.
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html): mechanisms and simplified attention models.
- [Gregory Chaitin: On the intelligibility of the universe and the notions of simplicity, complexity and irreducibility](https://arxiv.org/abs/math/0210035): background on algorithmic information and limits of compression.

The philosophical section distinguishes exact reproduction, compression, and human explanation. A generic counting argument for incompressible functions does not establish that trained LLMs resist useful simplification.
