# @rkesters/git-rev

![node version](https://img.shields.io/node/v/@rkesters/git-agent)
[![npm module](https://img.shields.io/npm/v/@rkesters/git-agent)](https://www.npmjs.com/package/@rkesters/git-agent)

Synchronously get the current git commit hash, tag, count, branch or commit message.


## usage

```typescript
import git from "@rkesters/git-agent";

// short commit-hash
console.log(git.commitHash(true)); // 75bf4ee

// long commit-hash
console.log(git.commitHash()); // 75bf4eea9aa1a7fd6505d0d0aa43105feafa92ef

// branch name
console.log(git.branchName()); // master
```

## installation

```bash
npm install --save-dev @rkesters/git-agent
```
