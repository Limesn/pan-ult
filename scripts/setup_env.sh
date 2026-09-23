#!/usr/bin/env sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
CONFIG_DIR="$PROJECT_ROOT/config"

require_command() {
	if ! command -v "$1" >/dev/null 2>&1; then
		printf '缺少必需命令: %s\n' "$1" >&2
		return 1
	fi
}

copy_template_if_missing() {
	template=$1
	target=$2

	if [ ! -f "$target" ]; then
		cp "$template" "$target"
		printf '已创建配置文件: %s\n' "${target#$PROJECT_ROOT/}"
	else
		printf '保留已有配置文件: %s\n' "${target#$PROJECT_ROOT/}"
	fi
}

printf '检查开发环境...\n'
missing=0
for command_name in cmake c++ node npm drogon_ctl mysql_config; do
	if ! require_command "$command_name"; then
		missing=1
	fi
done

if [ "$missing" -ne 0 ]; then
	printf '请安装缺失依赖后重新运行此脚本。\n' >&2
	exit 1
fi

mkdir -p "$PROJECT_ROOT/data/objects" "$PROJECT_ROOT/data/temp"
copy_template_if_missing "$CONFIG_DIR/server.conf.template" "$CONFIG_DIR/server.conf"
copy_template_if_missing "$CONFIG_DIR/feishu.conf.template" "$CONFIG_DIR/feishu.conf"

printf '\n环境初始化完成。启动服务前请设置以下环境变量：\n'
printf '%s\n' '  MYSQL_USER MYSQL_PASSWORD FEISHU_APP_ID FEISHU_APP_SECRET JWT_SECRET'
printf '%s\n' '然后可运行 ./scripts/build.sh 构建项目。'

