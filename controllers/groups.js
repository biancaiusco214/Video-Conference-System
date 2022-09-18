const Group = require('../models/group');
const User = require('../models/user');
const mongoose = require('mongoose');
var _ = require('underscore');

module.exports.index = async (req, res) => {
    const groups = await (await Group.find({}).populate('author'));
    res.render('groups/index', { groups });
}

module.exports.renderNewGroup = (req, res) => {
    res.render('groups/new');
}

module.exports.createGroup = async (req, res, next) => {
    const group = new Group(req.body.group);
    group.image.url = req.file.path;
    group.image.filename = req.file.filename;
    group.author = req.user._id;
    group.members.push(req.user._id);
    await group.save();
    req.flash('success', 'Successfully made a new group!');
    res.redirect(`/groups/${group._id}`)
}

module.exports.showGroup = async (req, res) => {
    const group = await (await Group.findById(req.params.id).populate('author members'));
    if (!group) {
        req.flash('error', 'Cannot find that group!');
        return res.redirect('/groups');
    }
    res.render('groups/show', { group });
}

module.exports.editGroup = async (req, res, next) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) {
        req.flash('error', 'Cannot find that group!');
        return res.redirect('/groups');
    }
    res.render('groups/edit', { group });
}

module.exports.updateGroup = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(id, { ...req.body.group });
    group.image.url = req.file.path;
    group.image.filename = req.file.filename;
    console.log(req.body);
    await group.save();
    req.flash('success', 'Successfully updated group!');
    res.redirect(`/groups/${group.id}`);
}

module.exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted group')
    res.redirect('/groups');
}

module.exports.Call = async (req, res) => {
    const group = await Group.findById(req.params.id).populate('author');
    if (!group) {
        req.flash('error', 'Cannot find that group!');
        return res.redirect('/groups');
    }
    //res.redirect(`/groups/${group.id}/${uuidv4()}`);
    res.redirect(`/groups/${group.id}/calling_${group.id}`);
};

module.exports.Calling = (req, res) => {
    res.render("rooms/room", { roomId: req.params.room });
};

module.exports.AddUser = async (req, res) => {
    const { id } = req.params;
    const group = await Group.findById(id);
    console.log(req.body.group.members);
    const aux = req.body.group.members;
    const users = aux.split(",");
    for (const i of users) {
        const user = await User.findById(i);
        let k = mongoose.Types.ObjectId(i);
        //k._id = i
        let flag = true;
        for (const j of group.members) {
            if (_.isEqual(j, k)) {
                flag = false;
                break;
            }
        }
        if (flag === true) {
            group.members.push(k);
        }
        else {
            console.log(i, "already in the DB");
        }
    }
    await group.save();
    req.flash('success', 'Successfully added members to the group!');
    res.redirect(`/groups/${group.id}`);
}

module.exports.AddMembers = async (req, res, next) => {
    const { id } = req.params;
    const group = await (await Group.findById(req.params.id).populate('author members'));
    if (!group) {
        req.flash('error', 'Cannot find that group!');
        return res.redirect('/groups');
    }
    res.render('groups/members', { group });
}