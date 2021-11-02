<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

## Auto-Release

A Github action that can automatically generate release ✨

## How To Use

## Example

```yml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Get the version
        id: get_version
        run: echo ::set-output name=VERSION::${GITHUB_REF/refs\/tags\//}

      - name: create-release
        if: github.event.ref_type == 'tag'
        uses: arco-actions/auto-release@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          changelogPaths: 'docs/changelog.en-US.md,docs/changelog.zh-CN.md'
          tagName: ${{ steps.get_version.outputs.VERSION }}
```

## Description

```yml
inputs:
  token:
    required: true
    description: 'the GITHUB_TOKEN'
  changelogPaths: # change this
    required: true
    description: 'the file path to changeLogs'
  tagName:
    required: true
    description: 'The name of the tag associated with this release'
  ref:
    description: 'github ref'
    default: 'main'
  headLevel:
    default: '2'
    description: 'Used to extract changelog, Title level in markdown. eg like `## version xxx`'
  draft:
    description: 'true to create a draft (unpublished) release, false to create a published one.'
    default: false
  prerelease:
    description: 'true to identify the release as a prerelease. false to identify the release as a full release.'
    default: false
```

## THANKS

Thanks for providing the code template [actions/typescript-action](https://github.com/actions/typescript-action)

## LICENSE

This project is [MIT licensed](./LICENSE).
