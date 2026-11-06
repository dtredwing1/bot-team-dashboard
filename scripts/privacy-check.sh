#!/usr/bin/env bash
# Fails if likely private data appears in the given path (default: repo).
# This file is excluded from its own scans. Keep research notes, raw exports,
# and handoff reports out of site/ — the image publishes site/ only.
target="${1:-.}"
fail=0
check(){ if grep -RIinE --exclude-dir=.git --exclude=privacy-check.sh "$2" $target; then echo "!! $1"; fail=1; fi; }
check "email"          '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}'
check "dollar amount"  '\$[0-9]|[0-9]+ ?(USD|dollars)'
check "IPv4"           '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b'
check "run.app/hosts"  'run\.app|\.local\b|\.lan\b|SSID|192\.168|10\.0\.'
check "account/ids"    '(^|[^#0-9a-fA-F])[0-9]{6,}|\b(acct|account) ?#|bot[_-]?id|store-[0-9a-f]{8}'
check "uuid"           '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
check "street address" '[0-9]+ [A-Z][a-z]+ (St|Street|Ave|Rd|Road|Dr|Lane|Ln|Blvd)\b'
check "school/kid"     'elementary|middle school|high school|academy|\bDAC\b|kindergarten|preschool'
# Obsolete roster-gallery headlines and hooks. Match the old public phrases,
# not a bare "idea", so a note that forbids the feature does not false-positive.
check "gallery phrasing" 'Ideas to steal|ideas you can borrow|#ideas\b|#idea-list|\.ideas\b|D\.ideas|id="ideas"|id="idea-list"|class="ideas"'
# Private names and retired display names belong only in this excluded file,
# as additional check calls. The reviewed public roster added no further
# literals. Do not copy research notes or name lists into site/ or docs.
site_dir=""
if [ -d "$target/site" ]; then site_dir="$target/site"; elif [ -d "$target" ] && [ "$(basename "$target")" = "site" ]; then site_dir="$target"; elif [ -d site ]; then site_dir="site"; fi
if [ -n "$site_dir" ]; then
  if find "$site_dir" -type f \( -name '*.md' -o -name '*evidence*' -o -name '*handoff*' -o -name '*research*' \) | grep -q .; then
    echo "!! research artifact in site/"
    find "$site_dir" -type f \( -name '*.md' -o -name '*evidence*' -o -name '*handoff*' -o -name '*research*' \)
    fail=1
  fi
fi
exit $fail
