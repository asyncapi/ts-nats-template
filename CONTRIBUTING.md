# Overview
To contribute to this project, follow the rules from the general [CONTRIBUTING.md](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) document in the community repository.

## Getting started
Extending the contribution guidelines above here is how to quick start your contribution process.
* The template is rendered using the AsyncAPI generator React renderer, [the authoring docs](https://github.com/asyncapi/generator/blob/master/docs/authoring.md#react-1) is great way to quick start your template journey to understand the setup.
* The template support two examples generations which is used to inspect your changes. These can be generated using the scripts `npm run generate:examples`.
* In most cases committing changes to the examples is a good thing, but try not to clutter up the PR and in the end before merging the those changes MUST be removed. Once your PR is merged the examples will be auto-generated and committed automatically by the CI. This is to ease the PR review process.
* If you are using VSCode two launch actions are provided to easily debug the generation of the examples. You can find these under the left side menu in VSCode - `Run and Debug`.
* Before requesting a review for your PR ensure that all CI checks succeeds, if you don't know why they fail feel free to tag one of the main contributors.
* If you are stuck or just want to discuss things feel free to reach out on [slack](https://www.asyncapi.com/slack-invite).