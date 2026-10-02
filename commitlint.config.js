/**
 * Conventional Commits rules. See the "Git & commits" section in AGENTS.md.
 * Enforced locally by the Husky `commit-msg` hook and in CI.
 */
export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'build', 'ci', 'perf', 'revert']
		],
		'scope-enum': [2, 'always', ['routes', 'lib', 'stories', 'build', 'ci', 'deps', 'docs']],
		'header-max-length': [2, 'always', 72],
		'subject-case': [2, 'always', ['lower-case']],
		'subject-full-stop': [2, 'never', '.'],
		'subject-empty': [2, 'never']
	}
};
