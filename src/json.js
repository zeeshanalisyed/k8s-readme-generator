module.exports.jsonManifestPrser = (data) => {
    return data.map((itr, i) => {
      const { kind, metadata } = itr;
      const { name, namespace } = metadata;
      return CreateResrcTemplate(kind, name, namespace, i + 1, itr);
    }).join('\n');
}

function Base(obj) {
    // Compnenets
}

function CreateResrcTemplate(kind, name, namespace, num, obj) {
    let temp = 'Creating K8s Native Resource';
    let { data = {}, rules = [], roleRef, subjects = [], spec = {} } = obj;
    let { selector } = spec;
    data = parseDataField(data);
    name = codehlight(name);
    namespace = namespace ? codehlight(namespace) : '';

    let rootstr =  `${num}. ${temp} ${codehlight(kind)} ${name} in ${namespace}`; 

    if (data.length) {
        rootstr = `${rootstr} having ${codehlight('data')} ${data.join("\n")}`
    }

    if (rules.length) {
        rootstr = `${rootstr} ${parseRuleField(rules)} ${parseRuleField(rules)}`;
    }

    if (roleRef && subjects.length) {
        rootstr =`${rootstr} ${parseRoleBinding(roleRef, subjects)}`;
    }

    if (selector) {
        rootstr =`${rootstr} ${parseKind(selector, kind)}`;
    }

    return rootstr;
}

function parseRuleField(data) {
    return data.map(rule => {
        let { apiGroups, resources = [], verbs } = rule;
        if (Array.isArray(verbs)) {
          verbs = verbs.join(" and ");
        }
        resources = resources.map(r => `${apiGroups}/${r}`).join(' and ')
        let str = `can perform actions: ${codehlight(verbs)} on ${codehlight(resources)}`;
        return str;
    })
}

function parseKind(s, k) {
    var rsrc = '';
    var str = '';
    switch(k) {
        case 'Service':
            rsrc = 'Pods';
            str = `Created for ${codehlight(rsrc)} with labels ${parseDataField(s).join(' and ')}`
            break;
        case 'Deployment':
            rsrc = 'Pods';
            str = `Created for ${codehlight(rsrc)} with matchLabels ${parseDataField(s.matchLabels).join(' and ')}`
            break;    
    }
    
    return str;

}

function parseRoleBinding(roleRef, subjects) {
    let { name } = roleRef;
    let str = ` of ${name} with accounts: `;
    let strn = subjects.map(s => `${codehlight(s.name)} in namespace: ${codehlight(s.namespace)}`);
    return `${str} ${strn}`; 
}

function parseDataField(data) {
  const keys = Object.keys(data);
  if (keys.length) {
    return keys.map(key => {
        const combined = `${key}:${data[key]}`;
        return codehlight(combined);
    });
  }
  return '';
}

function codehlight(text) {
  return `\`\`\`${text}\`\`\``
}