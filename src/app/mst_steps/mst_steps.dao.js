const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        let where = '';
        if (data.steptype !== undefined && data.steptype !== null && data.steptype !== '') {
            where += ' AND steptype=' + data.steptype;
        }
        const sql = "SELECT stepid, stepdesc, sequenceno, istableview, steptype  from mst_steps where reraid = ? AND deleted='0' " + where + " ORDER BY sequenceno ASC";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkName  = async(reraid, name, id) => {
    try {
        let where = '';
        if (id !== 0) {
            where += " AND stepid != " + id;
        }
        const sql = "SELECT stepid  from mst_steps where reraid = ? AND stepdesc = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, name]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

async function lastSequence(reraid) {
    try{
        const sql = "SELECT sequenceno FROM mst_steps WHERE deleted='0' AND reraid = ? ORDER BY sequenceno desc LIMIT 1"
        const [result] = await  readConn.query(sql,[reraid]);
        return result.length > 0 ? Number(result[0].sequenceno) + 1 : 1;
    } catch(e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.add  = async(data) => {
    try {
        data.sequenceno = await lastSequence(data.reraid);
        const sql = "INSERT INTO mst_steps (stepdesc, sequenceno, reraid, istableview, steptype) values (?,?,?,?,?)";
        const [result] = await  writeConn.query(sql,[data.stepdesc, data.sequenceno, data.reraid, data.istableview, data.steptype]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        const sql = "UPDATE mst_steps SET stepdesc = ?, istableview=? WHERE stepid = ?";
        const [result] = await  writeConn.query(sql,[data.stepdesc, data.istableview, data.stepid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateSequence  = async(data) => {
    try {
        let i = 0;
        for (const obj of data) {
            const sql = "UPDATE mst_steps SET sequenceno = ? WHERE stepid = ?";
            util.createLog(sql)
            console.log(obj.sequenceno, obj.stepid)
            const [result] = await  writeConn.query(sql,[obj.sequenceno, obj.stepid]);
            if (data.length === (i + 1)) {
                return true;
            }
            i++;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_steps SET deleted = '1' WHERE stepid = ?";
        const [result] = await  writeConn.query(sql,[data.stepid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}