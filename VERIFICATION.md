# Verification — October 14, 2026

The revised six-token sentence model passed seven automated tests with Node 24:

- All 9,330 sequences of lengths 1–5 match a separately implemented scalar equation and the count-based shortcut described in the philosophical section.
- The “the cat” example matches its hand-derived queries, keys, values, mixture, logits, and probabilities.
- Attention rows and final probability distributions normalize to one; all future attention entries are zero.
- All four cat/dog × runs/sleeps sentence endings predict a period. Greedy completion from “the” produces “the cat runs.” From “the dog” it produces “the dog runs.”
- Stable softmax, 64-token inputs, invalid input, case normalization, punctuation tokenization, repeated tokens, and order-equivalent inputs pass.

Manual Chrome browser verification covered:

- All seven computation views, embedding selection, matrix-column selection, and softmax slider.
- Sentence completion with visible token-by-token probability history and stopping at the predicted period.
- Invalid-input messages, presets, attached punctuation, keyboard tab navigation with arrows/Home/End, and the full causal attention table.
- Desktop, 390px phone, and 320px narrow phone layouts. No document-level horizontal overflow was observed; wide tables and the assembled equation scroll within their panels.
- Downloaded JSON trace checked for the revised model identity, current prompt, normalized probabilities, and serialized masked values.
- No browser console errors observed.

Accessibility provisions include semantic landmarks, heading structure, labels, visible focus rings, a skip link, keyboard controls, live error/status messages, text alternatives, reduced-motion support, and touch-target adjustments. These checks do not constitute a formal accessibility audit or testing with all screen readers. Browser verification was performed in Chrome; other browsers were not manually tested.

The model's grammar preference is encoded in its hand-set weights. It is not trained, and arbitrary prompts or unconstrained sampling can produce ungrammatical text. Completion uses greedy decoding with vocabulary-order tie breaking; it applies no grammar filter.
