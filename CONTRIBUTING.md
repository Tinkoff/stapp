# Contributing

By contributing to Stapp, you agree to abide by the [code of conduct](https://github.com/TinkoffCreditSystems/stapp/blob/master/code-of-conduct.md).

## Instructions

These steps will guide you through contributing to this project:

- Fork the repo

- Clone it and install dependencies
```bash
git clone https://github.com/TinkoffCreditSystems/stapp
npm install
```

- Make your changes. Make sure the commands `npm run build` and `npm run test` are working.

### Committing

Please, commit changes with `npm run cz`. This will run commitizen, which will protect you against commit message pain. You may also install comittizen globall and commit with `git cz`.

You'll be asked about the changes scope. Please, select among the following:

* `core` - any feature and tests changes related to the core `stapp` package
* `validate` - any feature and tests changes related to the `stapp-validate` package
* `loaders` - any feature and tests changes related to the `stapp-loaders` package
* `formbase`- any feature and tests changes related to the `stapp-formbase` package
* `persist` - any feature and tests changes related to the `stapp-persist` package
* `react` - any feature and tests changes related to the `stapp-react` package
* `all` - when your changes a related to every single package

Finally send a GitHub Pull Request with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).
