#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/22 11:02
from server.database.link_database import LinkDatabase


def get_userinfo(id: str, database: LinkDatabase) -> dict:
    userinfo = database.search_data("USER", "user", {"id": id})
    del (userinfo["_id"])
    del(userinfo["password"])
    return userinfo
