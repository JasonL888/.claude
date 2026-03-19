---
name: playwright-cli
description: Use Playwright CLI for browser automation, testing, code generation, screenshots, and debugging. Trigger when the user asks to run Playwright tests, generate test code, take screenshots with Playwright, use the trace viewer, or run any `playwright` CLI command.
---

# Playwright CLI Skill

Use the Playwright CLI (`npx playwright` or `playwright`) to run tests, generate code, capture screenshots, and debug browser automation.

---

## Installation

```bash
# Install Playwright and browsers
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test

# Install browsers
npx playwright install

# Install specific browsers only
npx playwright install chromium firefox webkit
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/login.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run in headed mode (visible browser)
npx playwright test --headed

# Run in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in debug mode
npx playwright test --debug

# Run with UI mode (interactive)
npx playwright test --ui

# Run with specific number of workers
npx playwright test --workers=4

# Run only failed tests from last run
npx playwright test --last-failed

# Update snapshots
npx playwright test --update-snapshots
```

---

## Code Generation

```bash
# Open browser and record interactions → generate test code
npx playwright codegen https://example.com

# Save generated code to a file
npx playwright codegen https://example.com --output=tests/generated.spec.ts

# Record in a specific browser
npx playwright codegen --browser=firefox https://example.com

# Record with a specific viewport
npx playwright codegen --viewport-size=1280,720 https://example.com

# Record with authentication state
npx playwright codegen --load-storage=auth.json https://example.com
```

---

## Screenshots & PDFs

```bash
# Take a screenshot
npx playwright screenshot https://example.com screenshot.png

# Full page screenshot
npx playwright screenshot --full-page https://example.com full.png

# Screenshot in a specific browser
npx playwright screenshot --browser=webkit https://example.com out.png

# Generate PDF (Chromium only)
npx playwright pdf https://example.com output.pdf
```

---

## Viewing Reports & Traces

```bash
# Show HTML test report
npx playwright show-report

# Show report from a specific path
npx playwright show-report my-report/

# Open trace viewer with a trace file
npx playwright show-trace trace.zip
```

---

## Opening a Browser

```bash
# Open browser to a URL (for inspection/debugging)
npx playwright open https://example.com

# Open in a specific browser
npx playwright open --browser=firefox https://example.com
```

---

## Common Workflows

### Running Tests with Full Output

```bash
npx playwright test --reporter=list
npx playwright test --reporter=html   # generates HTML report
npx playwright test --reporter=dot    # minimal output
```

### Debugging a Failing Test

```bash
# Step through with Playwright Inspector
npx playwright test tests/foo.spec.ts --debug

# Slow down execution
PWDEBUG=1 npx playwright test tests/foo.spec.ts
```

### Capturing Auth State for Reuse

```bash
# Use codegen to capture login state
npx playwright codegen --save-storage=auth.json https://app.example.com

# Reuse stored auth in tests
npx playwright codegen --load-storage=auth.json https://app.example.com/dashboard
```

### CI/CD Usage

```bash
# Headless (default in CI), with retries and HTML report
npx playwright test --reporter=html --retries=2
```

---

## Configuration (`playwright.config.ts`)

Key options to know:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

---

## Tips

- Use `--ui` mode for interactive test development — it shows the test tree, live browser, and time-travel debugging.
- `--debug` launches Playwright Inspector for step-by-step execution.
- Traces (`trace.zip`) contain full network, DOM snapshots, and console logs — always enable `trace: 'on-first-retry'` in CI.
- `codegen` is the fastest way to scaffold new tests — record, then clean up the output.
- Use `--project` to isolate cross-browser runs during development.
