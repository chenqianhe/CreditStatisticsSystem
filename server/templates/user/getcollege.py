#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/15 13:16
from server.database.link_database import LinkDatabase


def get_college(database: LinkDatabase) -> dict:
    all_college = database.get_data("convert", "convert")

    colleges = {}
    for data in all_college:
        if data["college"] not in colleges.keys():
            colleges[data["college"]] = {}
        if data["major"] not in colleges[data["college"]].keys():
            colleges[data["college"]][data["major"]] = []
        colleges[data["college"]][data["major"]].append(data["classtype"])

    return colleges
