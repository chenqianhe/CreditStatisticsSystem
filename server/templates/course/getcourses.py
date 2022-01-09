#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 18:58
from server.database.link_database import LinkDatabase


def get_courses(id: str, database: LinkDatabase) -> dict:
    details = database.search_data("USER", "user", {"id": id})

    database_datails = database.search_data("convert", "convert", {"college": details["college"],
                                                                   "major": details["major"],
                                                                   "classtype": details["classtype"]})

    database_name, requiredcollection, electivecollection, outside, url, publicelectivedemandinall = database_datails["database"], \
                                                                     database_datails["requiredcollection"], \
                                                                     database_datails["electivecollection"], \
                                                                     database_datails["outside"], \
                                                                     database_datails["url"], \
                                                                     database_datails["publicelectivedemand"]

    score = {"requiredscore": database_datails["requiredsccore"], "electivescore": database_datails["electivescore"],
             "publicscore": database_datails["publicscore"], "outsidescore": database_datails["outsidescore"]}

    publicelectivedemand = {course.split(":")[0]: float(course.split(":")[1]) for course in publicelectivedemandinall.split(", ")}

    required_courses = database.get_data(database_name, requiredcollection)
    professional_elective_courses = database.get_data(database_name, electivecollection)
    public_elective_courses = database.get_data("publiccourse", "publicelectivecourse")
    outside_course = database.get_data(database_name, outside)
    self_course = {"required": {
        "course": database.search_data("course", "required", {"id": id})["course"],
        "credit": database.search_data("course", "required", {"id": id})["credit"]},
        "professionalelective": {
            "course": database.search_data("course", "professionalelective", {"id": id})["course"],
            "credit": database.search_data("course", "professionalelective", {"id": id})["credit"]},
        "professionalpreparation": {
            "course": database.search_data("course", "professionalpreparation", {"id": id})["course"],
            "credit": database.search_data("course", "professionalpreparation", {"id": id})["credit"]},
        "publicelective": {
            "course": database.search_data("course", "publicelective", {"id": id})["course"],
            "credit": database.search_data("course", "publicelective", {"id": id})["credit"]},
        "publicpreparation": {
            "course": database.search_data("course", "publicpreparation", {"id": id})["course"],
            "credit": database.search_data("course", "publicpreparation", {"id": id})["credit"]},
        "outside": {
            "course": database.search_data("course", "outside", {"id": id})["course"],
            "credit": database.search_data("course", "outside", {"id": id})["credit"]}
    }

    return {"id": id,
            "required_courses": required_courses,
            "professional_elective_courses": professional_elective_courses,
            "public_elective_courses": public_elective_courses,
            "outside_course": outside_course,
            "publicelectivedemand": publicelectivedemand,
            "url": url,
            "self_course": self_course,
            "score": score}
