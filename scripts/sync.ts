#!/usr/bin/env bun
// Sync skills/<name>/SKILL.md → plugins/<name>/skills/<name>/SKILL.md
// Source of truth: skills/. Plugins tree is regenerated on every run.
// Run before committing any change to skills/.

import { readdirSync, statSync, existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const skillsDir = join(repoRoot, "skills");
const pluginsDir = join(repoRoot, "plugins");
const marketplacePath = join(repoRoot, ".claude-plugin", "marketplace.json");

type PluginEntry = {
  name: string;
  source: string;
  description: string;
  version: string;
};

const skillNames = readdirSync(skillsDir)
  .filter((name) => statSync(join(skillsDir, name)).isDirectory())
  .filter((name) => existsSync(join(skillsDir, name, "SKILL.md")));

const entries: PluginEntry[] = [];

for (const name of skillNames) {
  const srcSkill = join(skillsDir, name, "SKILL.md");
  const pluginRoot = join(pluginsDir, name);
  const pluginManifestPath = join(pluginRoot, ".claude-plugin", "plugin.json");
  const destSkillDir = join(pluginRoot, "skills", name);
  const destSkill = join(destSkillDir, "SKILL.md");

  mkdirSync(join(pluginRoot, ".claude-plugin"), { recursive: true });
  mkdirSync(destSkillDir, { recursive: true });
  copyFileSync(srcSkill, destSkill);

  let manifest: { name: string; description: string; version: string; author?: { name: string } };
  if (existsSync(pluginManifestPath)) {
    manifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));
  } else {
    const frontmatter = parseFrontmatter(readFileSync(srcSkill, "utf8"));
    manifest = {
      name,
      description: frontmatter.description ?? `Skill: ${name}`,
      version: "1.0.0",
      author: { name: "AI Creative Lab" },
    };
    writeFileSync(pluginManifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }

  entries.push({
    name: manifest.name,
    source: `./plugins/${name}`,
    description: manifest.description,
    version: manifest.version,
  });
}

const marketplace = {
  name: "ai-creative-lab",
  owner: { name: "AI Creative Lab" },
  plugins: entries,
};

writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + "\n");

console.log(`Synced ${entries.length} skill(s): ${entries.map((e) => e.name).join(", ")}`);

function parseFrontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    out[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return out;
}
