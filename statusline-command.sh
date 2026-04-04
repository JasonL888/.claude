#!/bin/sh
JQ=/opt/homebrew/bin/jq
input=$(cat)

# --- context usage ---
ctx_used=$(echo "$input" | $JQ -r '.context_window.used_percentage // empty')
if [ -n "$ctx_used" ]; then
  ctx_int=$(printf '%.0f' "$ctx_used")
  if [ "$ctx_int" -ge 80 ]; then
    ctx_color="\033[31m"   # red
  elif [ "$ctx_int" -ge 50 ]; then
    ctx_color="\033[33m"   # yellow
  else
    ctx_color="\033[32m"   # green
  fi
  ctx_str=$(printf "${ctx_color}ctx:%d%%\033[0m" "$ctx_int")
else
  ctx_str=""
fi

# --- token tally ---
total_in=$(echo "$input" | $JQ -r '.context_window.total_input_tokens // 0')
total_out=$(echo "$input" | $JQ -r '.context_window.total_output_tokens // 0')
if [ "$total_in" -gt 0 ] || [ "$total_out" -gt 0 ]; then
  fmt_in=$(awk -v n="$total_in" 'BEGIN { if (n >= 1000) printf "%.1fk", n/1000; else printf "%d", n }')
  fmt_out=$(awk -v n="$total_out" 'BEGIN { if (n >= 1000) printf "%.1fk", n/1000; else printf "%d", n }')
  tally_str=$(printf "\033[90min:%s out:%s\033[0m" "$fmt_in" "$fmt_out")
else
  tally_str=""
fi

# --- session cost ---
model_id=$(echo "$input" | $JQ -r '.model.id // ""')
# Pricing per 1M tokens (input / output). Default to Sonnet 4 rates.
case "$model_id" in
  *opus*)        in_rate="15.0";  out_rate="75.0"  ;;
  *haiku*)       in_rate="0.8";   out_rate="4.0"   ;;
  *sonnet-4-5*)  in_rate="3.0";   out_rate="15.0"  ;;
  *)             in_rate="3.0";   out_rate="15.0"  ;;
esac
cost=$(awk -v i="$total_in" -v o="$total_out" -v ir="$in_rate" -v or="$out_rate" \
  'BEGIN { printf "%.3f", (i * ir / 1000000) + (o * or / 1000000) }')
cost_str=$(printf "\033[35m\$%s\033[0m" "$cost")

# --- assemble ---
first=1
for part in "$tally_str" "$ctx_str" "$cost_str"; do
  if [ -n "$part" ]; then
    if [ "$first" -eq 1 ]; then
      printf "%b" "$part"
      first=0
    else
      printf " %b" "$part"
    fi
  fi
done
exit 0
