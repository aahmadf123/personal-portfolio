# CSS Linting Guide

This project uses [Stylelint](https://stylelint.io/) to enforce consistent CSS styling and catch syntax errors before they cause issues in production.

## Getting Started

The linting setup is already configured in the project. You can run the linter using the following npm scripts:

\`\`\`bash
# Lint all CSS files
npm run lint:css

# Lint and automatically fix issues where possible
npm run lint:css -- --fix

# Lint both JavaScript/TypeScript and CSS files
npm run lint:all
\`\`\`

## Pre-commit Hooks

The project is configured with pre-commit hooks using Husky and lint-staged. This means that CSS files will be automatically linted (and fixed if possible) when you commit changes.

## Configuration

The Stylelint configuration is defined in `.stylelintrc.json` at the root of the project. It extends the standard configuration with some customizations specific to our project.

### Key Rules

- **No double-slash comments**: CSS only supports `/* */` style comments, not `//` comments
- **Consistent spacing**: Enforces consistent spacing around colons, commas, and other punctuation
- **Alphabetical property ordering**: Properties within rules are ordered alphabetically
- **Color formatting**: Enforces lowercase hex colors and short notation where possible
- **No vendor prefixes**: Discourages manual vendor prefixes (use Autoprefixer instead)
- **No duplicate properties**: Prevents accidental duplication of properties
- **No empty rules**: Prevents empty CSS rules

## Tailwind CSS Support

The configuration includes special handling for Tailwind CSS directives and at-rules.

## VSCode Integration

For the best development experience, install the Stylelint extension for VSCode:

1. Install the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
2. Add the following to your VSCode settings.json:

\`\`\`json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "postcss"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
}
\`\`\`

This will disable VSCode's built-in CSS validation and enable Stylelint to validate and auto-fix CSS files on save.

## Ignoring Files

If you need to ignore specific files or rules, you can:

1. Add files or directories to the `ignoreFiles` array in `.stylelintrc.json`
2. Add `/* stylelint-disable */` and `/* stylelint-enable */` comments around specific sections of code
3. Add `/* stylelint-disable-next-line */` before a specific line

## Troubleshooting

If you encounter issues with the linter:

1. Make sure you have all the dependencies installed: `npm install`
2. Try running with the verbose flag: `npm run lint:css -- --verbose`
3. Check if your CSS file is being ignored by the configuration
