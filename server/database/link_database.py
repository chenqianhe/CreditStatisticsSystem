#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/11/23 21:53

from pymongo import MongoClient


class LinkDatabase:
	"""
	连接数据库
	传入参数:
		host:数据库IP
		port:数据库端口
		account:数据库账号
		password:数据库密码
		database_name:数据库名
		collection:表名
	返回函数:
		get_data():数据库下表的内容
	"""

	def __init__(self, host: str, port: int, account: str, password: str):
		self.client = MongoClient(host, port)
		print("正在连接数据库...")
		# 连接mydb数据库,账号密码认证
		db = self.client.admin  # 先连接系统默认数据库admin
		db.authenticate(account, password, mechanism='SCRAM-SHA-1')  # 让admin数据库去认证密码登录
		print("认证完成！")

	def get_data(self, database_name: str, collection: str) -> list:
		my_db = self.client[database_name]
		collection = my_db[collection]
		data = []
		for i in collection.find():
			del(i["_id"])
			data.append(i)
		# print(data)
		return data

	def add_data(self, database_name: str, collection: str, data: dict):
		my_db = self.client[database_name]
		collection = my_db[collection]
		collection.insert_one(data)

	def count_data(self, database_name: str, collection: str, condition: dict) -> int:
		my_db = self.client[database_name]
		collection = my_db[collection]

		return collection.count_documents(condition)

	def search_data(self, database_name: str, collection: str, condition: dict) -> dict:
		my_db = self.client[database_name]
		collection = my_db[collection]

		return collection.find(condition).next()

	def change_data(self, database_name: str, collection: str, condition: dict, key: str, content):
		my_db = self.client[database_name]
		collection = my_db[collection]

		data = collection.find(condition).next()
		data[key] = content

		return collection.update(condition, data)