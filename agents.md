# Jules AI Agent Rules

- Do not commit changes incrementally.
- Do not stop execution when a single file is modified if other requested project files are still missing or incomplete.
- Complete the entire project file structure first.
- If a build step or test fails mid-way, resolve it locally in the VM without generating a PR or breaking the task loop.
- Only trigger the final commit phase once all project requirements are met.
