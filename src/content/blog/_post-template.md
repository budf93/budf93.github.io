---
title: 'Your next technical note'
description: 'A precise sentence about what this post explains.'
date: 2026-11-08
tags:
  - retrieval
draft: true
---

Copy this file to `my-post.md` or `my-post.mdx` (without the leading underscore).
The underscore excludes this template from the collection. Set `draft: false`
when ready to include a post in the site, RSS, and sitemap.

## A useful starting point

Inline mathematics: $P(y \mid x)$.

Display mathematics:

$$
\mathcal{K}_{t+1} = \mathcal{K}_t \cup \Delta_t
$$

```python
def reciprocal_rank(rank, k=60):
    return 1 / (k + rank)
```

| Approach | What to measure       |
| -------- | --------------------- |
| Baseline | Relevance and latency |

For an image, keep it alongside your post (for example `./images/example.png`)
and use Markdown: `![A useful description](./images/example.png)`.
This relative asset pipeline also handles project-repository base paths.

## Something to inspect

Explain assumptions and link to original sources.[^reference]

## Something to take forward

Connect the result to a concrete next question.

[^reference]: A footnote with a primary-source link belongs here.
