#!/bin/bash
# Скрипт перезапуска сайта Global Auto
# Добавить в crontab: 0 3 */7 * * /var/www/globalavto/server/restart.sh >> /var/log/globalavto-restart.log 2>&1

LOG_FILE="/var/log/globalavto-restart.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Запуск перезапуска Global Auto..." >> $LOG_FILE

# Перезапуск PM2
pm2 restart all >> $LOG_FILE 2>&1

# Перезагрузка nginx (без прерывания соединений)
nginx -s reload >> $LOG_FILE 2>&1

echo "[$DATE] Перезапуск завершён." >> $LOG_FILE
