from bs4 import BeautifulSoup
import json

path="/its/home/drs25/Downloads/palcal/palcal/backend/"
def get_input_modules() -> dict:
    with open(path+'input_modules.json', 'r') as f:
        return json.loads(f.read())

def get_input() -> str:
    with open(path+'input.html', 'r') as f:
        return f.read()


def get_bs4() -> BeautifulSoup:
    return BeautifulSoup(get_input(), features="html.parser")


def get_table():
    return get_bs4().find("table", {"id": "school_timetable_table"})

def get_times():
    return get_table().find("thead").findChildren()[0].findChildren()

def get_time_mappings():
    mapping = {}
    times = get_times()
    for x in range(0, len(times)):
        if x % 2 == 0:
            continue
        # Assert we actually have a time
        assert(len(times[x].decode_contents()) == 5)
        assert(int(times[x].decode_contents()[0:2]) < 21)
        assert(int(times[x].decode_contents()[0:2]) > 8)
        assert(times[x].decode_contents()[2] == ':')
        assert(times[x].decode_contents()[3] == '0')
        assert(times[x].decode_contents()[4] == '0')
        mapping[x-1] = int(times[x].decode_contents()[0:2])
    return mapping

def get_room_building_mapping(location: str):
    known_locations = [
        'Pevensey 1',
        'Arts A',
        'Richmond',
        'Chichester 1',
        'Chichester 2',
        'Chichester 3',
        'Fulton Building',
        'Friston Building',
        'Shawcross',
        'Silverstone',
        'Jms Building',
        'Arts C',
        'Ashdown House',
        'Jubilee Building',
        'Essex House',
        'Arundel Building',
        'John Clifford West'
    ]
    for building in known_locations:
        if location.startswith(building):
            return (building, location.replace(f'{building} ', ''))
    print(f'Unprocessed location {location}!!')
    return (location, '')

def get_sessions_per_day():
    sessions = []
    time_mapping = get_time_mappings()
    print(time_mapping)
    tbody = get_table().find('tbody')
    rows = tbody.findChildren(recursive=False)
    current_day = ""
    current_day_remaining_rows = -1
    day_str_to_int_mapping = {
        'Mon': 0,
        'Tue': 1,
        'Wed': 2,
        'Thu': 3,
        'Fri': 4
    }
    for row in rows:
        current_day_remaining_rows -= 1
        # We set this to sale, so only when at the beginning of a row do we say it could be a day
        could_be_day = True
        if current_day != "":
            assert(current_day_remaining_rows >= 0)
        current_row = 0
        
        for column in row.findChildren(recursive=False):
            if (len(column.decode_contents()) == 3 and could_be_day):
                current_day = column.decode_contents()
                current_day_remaining_rows = int(column['rowspan'])
                print(current_day)
                print(current_day_remaining_rows)
                continue
            assert(current_day != "")
            # Ok, we are in a day! Check if the current time has a session
            if (column.decode_contents() != ""):
                # YOOOO IT DOES!!!
                # now to do time mapping
                #print(column.decode_contents())
                assert(time_mapping.get(current_row) != None)
                start_time = time_mapping[current_row]
                staff = column.findChildren(recursive=False)[0]['title']
                session_details = column.findChildren(recursive=False)[0].decode_contents()
                # Split into different fields
                split = session_details.split("<br/>")
                # Cleanup the room location
                split[2] = split[2].split('\n')[0]
                # Cleanup the module code + group
                split[0] = split[0].replace('\n<nobr>', '').replace('</nobr>', '')
                duration = int(column['colspan']) / 2
                location = get_room_building_mapping(split[2])
                current_row += int(column['colspan'])
                data = {
                    'type': split[1],
                    'group': int(split[0].split(' ')[1].replace('(', '').replace(')', '')),
                    'module_code': split[0].split(' ')[0],
                    'building': location[0],
                    'room': location[1],
                    'day': day_str_to_int_mapping[current_day],
                    'start_time': start_time,
                    'duration': int(duration)
                }
                sessions.append(data)
                continue
            current_row += 1
    return sessions

def main():
    timetable_name = "Autumn Semester | Informatics"
    with open('data.json', 'w') as f:
        f.write(json.dumps({
            'name': timetable_name,
            'modules': get_input_modules()['modules'],
            'sessions': get_sessions_per_day()
        }))


if __name__ == '__main__':
    main()
