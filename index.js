const fs = require("fs");
const child_process = require("child_process");


const searchItem = (item) => {

    const command = `npm view ${item}-cli versions`;
   
    return new Promise((resolve) => {
        const worker = child_process.exec(command, {
            //10M
            maxBuffer: 10 * 1024 * 1024
        });
    
        worker.stdout.on("data", function(data) {
            //console.log(data.toString());
        });
    
        worker.stderr.on("data", function(data) {
            //console.log(data.toString());
        });
    
        worker.on("close", function(code) {
            if (code) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });

   
};

const showLeftList = (info) => {
    const leftList = [];
    let last = "a";
    Object.keys(info).forEach(k => {
        let n = "";
        if (!info[k]) {
            const s = k.substr(0, 1);
            if (s !== last) {
                n = "\n";
                last = s;
            }
            leftList.push(`${n}${k}, `);
        }
    });
    console.log(leftList.join(""));
};


const start = async () => {

    let info = {};
    const file = "info.json";
    if (fs.existsSync(file)) {
        info = JSON.parse(fs.readFileSync(file).toString("utf-8"));
    }

    //true exists
    //false not exists

    showLeftList(info);

    const l1 = "abcdefghijklmnopqrstuvwxyz".split("");
    const l2 = [].concat(l1);

    const list = [];
    l1.forEach(x => {
        l2.forEach(y => {
            const k = x + y;
            if (!info[k]) {
                list.push(k);
            }
        });
    });
   
    
    let i = 0;
    for (const item of list) {
        const per = `${((i / list.length) * 100).toFixed(2)}%`;
        console.log(`${i}/${list.length}`, item, per);
        info[item] = await searchItem(item);
        fs.writeFileSync(file, JSON.stringify(info, null, 4));
        i ++;
    }

    showLeftList(info);

};

start();