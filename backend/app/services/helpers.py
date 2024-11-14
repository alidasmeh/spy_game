import datetime


def convert_date_object_to_string(original_list):
    player_dicts = []
    for record in original_list:
        player_dict = {}
        for key, value in record.items():
            if not isinstance(value, datetime.datetime):
                player_dict[key] = value
        player_dicts.append(player_dict)

    return player_dicts
