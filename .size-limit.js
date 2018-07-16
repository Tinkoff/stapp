module.exports = [
  {
    name: 'stapp core',
    path: './packages/stapp/lib/stapp.js',
    webpack: false
  },
  {
    name: 'stapp-formbase',
    path: './packages/stapp-formBase/lib/index.js'
  },
  {
    name: 'stapp-loaders',
    path: './packages/stapp-loaders/lib/index.js'
  },
  {
    name: 'stapp-validate',
    path: './packages/stapp-validate/lib/index.js'
  },
  {
    name: 'stapp-persist',
    path: './packages/stapp-persist/lib/index.js'
  },
  {
    name: 'stapp-react',
    path: './packages/stapp-react/lib/index.js'
  },
  {
    name: 'Total',
    path: [
      './packages/stapp/lib/stapp.js',
      './packages/stapp-formBase/lib/index.js',
      './packages/stapp-loaders/lib/index.js',
      './packages/stapp-validate/lib/index.js',
      './packages/stapp-persist/lib/index.js',
      './packages/stapp-react/lib/index.js',
    ]
  }
]
