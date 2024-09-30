const minHour = 9;
const maxHour = 20;

const FILTER_TAG = '<a href="#" class="inline-block my-0.5 bg-indigo-600 px-1.5 py-1 rounded mx-0.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" name=""></a>'

window.UNKNOWN_MODULES = [];

function getData(callback) {
    fetch('/backend/data.json').then(function (requestData) {
        requestData.json().then(callback);
    })
}

function getValueFromSelect(selectId)  {
    var selectField = document.getElementById(selectId);
    return selectField.options[ selectField.selectedIndex ].value;
}

function addModuleFilter() {
    // i know it says remove, but it has an addInstead option
    // dont code at 8am
    removeDataFromQueryStringList('module', getValueFromSelect('timetable_module_form'), addInstead=true);
}

function addGroupFilter() {
    removeDataFromQueryStringList('group', getValueFromSelect('timetable_cohort_form'), addInstead=true);
}

function removeGroup(groupId) {
    removeDataFromQueryStringList('group', groupId);
}

// look, ok, the addInstead is dirty
// but it works
function removeDataFromQueryStringList(keyName, data, addInstead=false) {
    // OK, we have the data, time to remove it from the query string if present
    const urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get(keyName)
    if (query != null) {
        query = query.replace('%2C', ',');
    }
    if (addInstead) {
        if (query == null) {
            query = [];
        } else {
            query = query.split(',').filter(e => e != data).join(',');
            query = query.split(',');
        }
        query.push(data)
        query = query.join(',');
    } else {
        query = query.split(',').filter(e => e != data).join(',');
    }
    urlParams.delete(keyName);
    if (query.length != 0) {
        urlParams.set(keyName, query);
    }
    window.location.search = urlParams.toString();
}

function removeModule(moduleCode) {
    removeDataFromQueryStringList('module', moduleCode);
}

function buildActiveFilters(timetableData) {
    const urlParams = new URLSearchParams(window.location.search);
    var module_codes = urlParams.get('module');
    if (module_codes != null) {
        module_codes = module_codes.replace('%2C', ',');
    }
    console.log(module_codes);
    var groups = urlParams.get('group')
    if (groups != null) {
        groups = groups.replace('%2C', ',');
    }
    // Done retrieving data! check we have something to filter
    if (module_codes == null && groups == null) {
        return;
    }
    // Ok! Something to filter
    var filterBar = document.getElementById('active-filters');
    filterBar.innerHTML = '';
    if (groups != null) {
        groups = groups.split(',')
        var strings = buildCohortGeneratedStrings(groups);
        for(var i = 0; i < strings.length; i++) {
            var node = createNodeFromHtml(FILTER_TAG);
            node.innerHTML = strings[i];
            node.setAttribute('onclick', `removeGroup(${groups[i]})`);
            filterBar.appendChild(node);
        }
    }
    if (module_codes != null) {
        var allModules = getUniqueModules(timetableData);
        module_codes = module_codes.split(',')
        for(var i = 0; i < module_codes.length; i++) {
            var node = createNodeFromHtml(FILTER_TAG);
            var moduleName = null;
            for(var x = 0; x < allModules.length; x++) {
                if (allModules[x]['code'] == module_codes[i]) {
                    moduleName = allModules[x]['name']
                    break;
                }
            }
            // Above lookup didn't work
            if (moduleName==null) {
                moduleName = "unknown_module";
            }
            node.innerHTML = module_codes[i] + ' - ' + moduleName;
            node.setAttribute('onclick', `removeModule("${module_codes[i]}")`);
            filterBar.appendChild(node);
        }
    }
}

function buildTitles(timetableData) {
    var titles = document.getElementsByClassName('title');
    for (var i = 0; i < titles.length; i++) {
        var element = titles[i];
        element.innerHTML = timetableData['name']
    }
}

function getUniqueModules(timetableData) {
    var unique_module_codes = [];
    for (var i = 0; i < timetableData['sessions'].length; i++) {
        if (unique_module_codes.includes(timetableData['sessions'][i]['module_code'])) {
            continue;
        }
        unique_module_codes.push(timetableData['sessions'][i]['module_code'])
    }
    var modules = [];
    for (var i = 0; i < unique_module_codes.length; i++) {
        var module = timetableData['modules'][unique_module_codes[i].toString()];
        if (module == undefined) {
            if (!window.UNKNOWN_MODULES.includes(unique_module_codes[i])) {
                window.UNKNOWN_MODULES.push(unique_module_codes[i]);
                console.warn(`[Module lookup] Unknown module ${unique_module_codes[i]}`)
            }
            module = {
                "name": "Unknown module - check data.json"
            };
        }
        module['code'] = unique_module_codes[i];
        modules.push(module);
    }
    return modules;
}

function resolveModuleCode(moduleCode, timetableData) {
    var modules = getUniqueModules(timetableData);
    for (var i = 0; i < modules.length; i++) {
        if (modules[i]['code'] == moduleCode) {
            return modules[i];
        }
    }
    return {
        "name": "Unresolved module",
        "code": moduleCode
    };
}

function openAllUnknown() {
    for(var i = 0; i < window.UNKNOWN_MODULES.length; i++) {
        window.open('https://duckduckgo.com/?t=ffab&q=sussex+' + window.UNKNOWN_MODULES[i])
    }
}

function buildModuleForm(timetableData) {
    var modules = getUniqueModules(timetableData);
    var moduleForm = document.getElementById('timetable_module_form');
    for (var i = 0; i < modules.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", modules[i]['code'])
        option.innerHTML = `${modules[i]['name']} (${modules[i]['code']})`
        moduleForm.appendChild(option);
    }
}

function buildCohortGeneratedStrings(groups) {
    generatedStrings = []
    groups.sort();
    groups.forEach(element => {
        if (element == 7) {
            generatedStrings.push('Masters');
        } else if (element == 3) {
            generatedStrings.push('Foundation')
        } else {
            generatedStrings.push(`UG Year ${element - 3}`)
        }
    });
    return generatedStrings;
}
function buildCohortForm(timetableData) {
    groups = []
    for(var i = 0; i < timetableData['sessions'].length; i++) {
        if (groups.includes(timetableData.sessions[i].group)) {
            continue;
        }
        groups.push(timetableData.sessions[i].group);
    }
    var generatedStrings = buildCohortGeneratedStrings(groups);
    // Now we have the strings, actually make the form
    var cohortForm = document.getElementById('timetable_cohort_form');
    for (var i = 0; i < groups.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", groups[i]);
        option.innerHTML = generatedStrings[i];
        cohortForm.appendChild(option);
    }
}

function getRowTemplate(callback) {
    fetch('templates/row_template.html')
        .then((response) => response.text())
        .then((text) => callback(text));
}

function getSessionTemplate(callback) {
    fetch('templates/session_template.html')
        .then((response) => response.text())
        .then((text) => callback(text));
}

function checkIfInParamList(session, paramData, sessionKey) {
    const urlParams = new URLSearchParams(window.location.search);
    var paramQuery = urlParams.get(paramData);
    if (paramQuery != null) {
        paramQuery = paramQuery.replace('%2C', ',');
    }
    if (paramQuery != null && paramQuery != "") {
        var found = false;
        for(var i = 0; i < paramQuery.split(',').length; i++) {
            if (paramQuery.split(',')[i] == session[sessionKey].toString()) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

function doesModuleMatchQuery(session) {
    if (!checkIfInParamList(session, 'group', 'group')) {
        return false;
    }
    if (!checkIfInParamList(session, 'module', 'module_code')) {
        return false;
    }
    return true;
}

function getModulesForDay(timetableData, dayId, startTime) {
    var modulesForDay = [];
    for(var i = 0; i < timetableData['sessions'].length; i++) {
        var session = timetableData['sessions'][i];
        if (!doesModuleMatchQuery(session)) {
            continue;
        }
        if (session['day'] == dayId) {
            // Check if the time matchesc
            if (session['start_time'] <= startTime) {
                // Ok, the session has started, now... has it ended?
                // We can do this by adding the start_time to the duration
                // if the start_time + duration is larger than our queried time, the session is still ongoing
                if (session['start_time'] + session['duration'] > startTime) {
                    if (session['start_time'] != startTime) {
                        session['type'] = session['type'] + ' </div><br><span class="relative rounded-full px-3 py-1 text-xxs leading-6 bg-white text-black ring-1 ring-black font-semibold"><b>CONT</b></span>'
                    }
                    modulesForDay.push(session);
                }
            }
        }
    }
    return modulesForDay;
}

function createNodeFromHtml(htmlString, elementBase='div') {
    var div = document.createElement(elementBase);
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function formatSessionNode(sessionTemplate, sessionData, timetableData) {
    var node = createNodeFromHtml(sessionTemplate);
    node.getElementsByClassName('content-module-code')[0].innerHTML = sessionData['module_code'];
    node.getElementsByClassName('content-module-name')[0].innerHTML = resolveModuleCode(sessionData['module_code'], timetableData)['name'];
    node.getElementsByClassName('content-type')[0].innerHTML = sessionData['type']
    if (node.getElementsByClassName('content-time').length > 0) {
        node.getElementsByClassName('content-time')[0].innerHTML = `${sessionData['start_time'].toString().padStart(2, '0')}:00 - ${(sessionData['start_time'] + sessionData['duration']).toString().padStart(2, '0')}:00`;
    }
    // Correct "groups" to years
    if (sessionData['group']-3 == 4) {
        // Masters!
        node.getElementsByClassName('content-cohort')[0].innerHTML = 'Masters';
    } else if (sessionData['group'] == 3) {
        node.getElementsByClassName('content-cohort')[0].innerHTML = 'Foundation';
    } else {
        
        node.getElementsByClassName('content-cohort')[0].innerHTML = `UG Year ${(sessionData['group'])-3}`
    }
    return node;
}

function buildTimetable(timetableData) {
    // TODO: Do querying...
    getRowTemplate(function (rowTemplate) {
        getSessionTemplate(function (sessionTemplate) {
            var timetableBody = document.getElementById('timetable_body');
            for (var i = minHour; i <= maxHour; i++) {
                var time = `${i.toString().padStart(2, '0')}:00 - ${(i + 1).toString().padStart(2, '0')}:00`
                var rowNode = createNodeFromHtml(rowTemplate, elementBase='tbody');

                sessionsForWeek = [];
                for(var day = 0; day < 5; day++) {
                    sessionsForWeek.push(getModulesForDay(timetableData, day, i));
                }

                for(var day = 0; day < 5; day++) {
                    if (sessionsForWeek[day].length == 0) {
                        // No content!
                        rowNode.getElementsByClassName('content-day-' + day.toString())[0].innerHTML = '<i class="text-white/50 text-xs text-center w-full block">No sessions</i>';
                        continue;
                    }
                    rowNode.getElementsByClassName('content-day-'+day.toString())[0].innerHTML = "";
                    for (var x = 0; x < sessionsForWeek[day].length; x++) {
                        var session = sessionsForWeek[day][x];
                        // ok!! we now have a session
                        // lets send it to our formatter, to contain it there
                        var formattedNode = formatSessionNode(sessionTemplate, session, timetableData);
                        rowNode.getElementsByClassName('content-day-'+day.toString())[0].appendChild(formattedNode);
                    }
                }
                rowNode.getElementsByClassName('content-time')[0].innerHTML = time;
                timetableBody.appendChild(rowNode);
            }
        });
    });
}


function onLoad() {
    getData(function (timetableData) {
        buildActiveFilters(timetableData);
        buildTitles(timetableData);
        buildModuleForm(timetableData);
        buildCohortForm(timetableData);
        buildTimetable(timetableData);
    })
}

document.addEventListener('DOMContentLoaded', onLoad);

window.openAllUnknown = openAllUnknown;