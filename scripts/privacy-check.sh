#!/usr/bin/env bash
# Fails if likely private data appears in the given path (default: repo).
target="${1:-.}"
fail=0
check(){ if grep -RIinE --exclude-dir=.git --exclude=privacy-check.sh "$2" $target; then echo "!! $1"; fail=1; fi; }
check "email"          '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}'
check "dollar amount"  '\$[0-9]|[0-9]+ ?(USD|dollars)'
check "IPv4"           '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b'
check "run.app/hosts"  'run\.app|\.local\b|\.lan\b|SSID|192\.168|10\.0\.'
check "account/ids"    '(^|[^#0-9a-fA-F])[0-9]{6,}|\b(acct|account) ?#|bot[_-]?id|store-[0-9a-f]{8}'
check "street address" '[0-9]+ [A-Z][a-z]+ (St|Street|Ave|Rd|Road|Dr|Lane|Ln|Blvd)\b'
check "school/kid"     'elementary|middle school|high school|academy|\bDAC\b'
exit $fail
