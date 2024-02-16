#!/bin/bash
while IFS='=' read -r key value; do
  echo -n "$value" | vercel env add "$key" production
done < .env
