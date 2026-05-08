<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:image-generation-skill -->
# Image Generation Skill (gpt-image-2)

## Overview

This project uses the `image-provider-constraint` skill to generate and edit images via the `gpt-image-2` model. The skill is installed globally at `~/.claude/skills/image-provider-constraint/`.

When the user asks for image generation, editing, or raster visual creation, **invoke the skill first**:

```
Skill: image-provider-constraint
```

The skill will load its instructions and guide the generation process.

## API Configuration

- **Endpoint**: `https://www.tokenrouter.tech/pg/images/generations`
- **Model**: `gpt-image-2`
- **Auth**: Session cookie from tokenrouter.tech login + `new-api-user` header
- **Timeout**: At least 10 minutes (600000 ms) — image generation is slow

## Available Scripts

Three cross-platform wrappers are bundled in the skill's `scripts/` directory:

| Platform | Script | Usage |
|----------|--------|-------|
| **Windows** | `gpt_image_2.ps1` | PowerShell with curl.exe |
| **Linux/macOS** | `gpt_image_2.sh` | Shell with curl + base64 |
| **Any OS** | `gpt_image_2.py` | Python fallback (requires openai + httpx) |

## Invocation Examples

### Windows (PowerShell) — Generate

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "~/.claude/skills/image-provider-constraint/scripts/gpt_image_2.ps1" generate -Prompt "your prompt here" -Out "output/imagegen/result.png" -Force
```

### Windows (PowerShell) — Edit

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "~/.claude/skills/image-provider-constraint/scripts/gpt_image_2.ps1" edit -Prompt "edit instructions" -Image "source.png" -Out "output/imagegen/result.png" -Force
```

### Linux/macOS — Generate

```bash
sh "~/.claude/skills/image-provider-constraint/scripts/gpt_image_2.sh" generate --prompt "your prompt here" --out "output/imagegen/result.png" --force
```

### Linux/macOS — Edit

```bash
sh "~/.claude/skills/image-provider-constraint/scripts/gpt_image_2.sh" edit --prompt "edit instructions" --image "source.png" --out "output/imagegen/result.png" --force
```

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `-Prompt` / `--prompt` | (required) | Text prompt for generation/edit |
| `-PromptFile` / `--prompt-file` | — | Read prompt from file |
| `-N` / `--n` | 1 | Number of images (1-10) |
| `-Size` / `--size` | 1024x1024 | Image dimensions |
| `-Quality` / `--quality` | auto | auto, low, medium, high |
| `-OutputFormat` / `--output-format` | png | png, jpeg, webp |
| `-Out` / `--out` | output/imagegen/gpt-image-2.png | Output path |
| `-Force` / `--force` | false | Overwrite existing files |
| `-DryRun` / `--dry-run` | false | Preview payload without calling API |

## Fallback: Direct curl (tokenrouter.tech)

If the bundled scripts fail (e.g., auth issues), use curl directly with the tokenrouter.tech session:

```bash
curl 'https://www.tokenrouter.tech/pg/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'new-api-user: DNmlD3neCReVJFJlVjLxbJl7' \
  -H 'Cookie: <session-cookie>' \
  --data-raw '{"model":"gpt-image-2","group":"default","prompt":"your prompt","n":1,"referenceImages":[]}'
```

The response contains `data[].b64_json` — decode with `base64 -d` to save the PNG.

## Prompt Guidelines

- Keep prompts faithful to user intent — do not over-decorate or rewrite
- Match the site's dark sci-fi aesthetic: dark navy backgrounds, cyan/blue glow accents
- For service images: show realistic professional settings with subtle tech elements
- Avoid overly fantastical or abstract sci-fi imagery
<!-- END:image-generation-skill -->
