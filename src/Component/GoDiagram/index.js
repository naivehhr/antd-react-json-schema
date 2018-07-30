/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-14 17:52:38 
 * @overview				: 
 * @Last Modified time		: 2017-08-14 17:52:38 
 */
import './index.scss'
import React, { Component } from 'react'
import go from '../../Lib/go.js'
import { promiseConfirm } from 'Util'
import { ProcessSelect } from './processSelect.js'
import { BranchSelect } from './branchSelect.js'

const goObj = go.GraphObject.make
let delLock = true

export class GoDiagram extends Component {
    renderCanvas() {
        let _t = this

        let myDiagram = goObj(go.Diagram, this.refs.goJsDiv, {
            initialContentAlignment: go.Spot.Top,
            layout: goObj(go.LayeredDigraphLayout, {
                direction: 90,
                layerSpacing: 6,
                columnSpacing: 6,
                setsPortSpots: false
            }),
            maxSelectionCount: 1,
            allowDrop: true,
            allowCopy: false,

            "textEditingTool.starting": go.TextEditingTool.SingleClick,
            "SelectionDeleting": (e) => {
                // assume maxSelectionCount === 1
                var node = e.subject.first(),
                    category = node.data.category
                if (category == 'Start' || category == 'End' || delLock == true) {
                    e.cancel = true
                    return
                }
                exciseNode(e.subject.first()); // defined below
            },
            "SelectionDeleted": function (e) {
                deleteDisconnectedNodes(e.diagram); // defined below
            },
            "undoManager.isEnabled": false
        })

        myDiagram.addDiagramListener("Modified", function (e) {
            console.log("Modified")
            e.diagram.isModified = false;
            // var button = document.getElementById("SaveButton")
            // if (button) button.disabled = !e.diagram.isModified
            // var idx = document.title.indexOf("*")
            // if (e.diagram.isModified) {
            //     if (idx < 0) document.title += "*"
            // } else {
            //     if (idx >= 0) document.title = document.title.substr(0, idx)
            // }
        })

        myDiagram.findLayer("Tool").opacity = 0.5

        // Define a gradient brush for each Node type, shared by the Diagram and Palette
        var greenBrush = goObj(go.Brush, "Linear", {
            0: "rgb(200,255,200)",
            .67: "rgb(15,160,15)"
        })
        var redBrush = goObj(go.Brush, "Linear", {
            0: "rgb(255,240,240)",
            .67: "rgb(255,0,0)"
        })
        var blueBrush = goObj(go.Brush, "Linear", {
            0: "rgb(250,250,255)",
            .67: "rgb(90,125,200)"
        })
        var yellowBrush = goObj(go.Brush, "Linear", {
            0: "rgb(255,255,240)",
            .67: "rgb(190,200,10)"
        })
        var pinkBrush = goObj(go.Brush, "Linear", {
            0: "rgb(255,250,250)",
            .67: "rgb(255,180,200)"
        })
        var lightBrush = goObj(go.Brush, "Linear", {
            0: "rgb(240,240,250)",
            .67: "rgb(150,200,250)"
        })

        function makeTooltip(str) { // a helper function for defining tooltips for buttons
            return goObj(go.Adornment, go.Panel.Auto,
                goObj(go.Shape, {
                    fill: "#FFFFCC"
                }),
                goObj(go.TextBlock, str, {
                    margin: 4
                })
            )
        }

        function canAddCard(adorn) {
            var node = adorn.adornedPart
            if (node.category == "Action") {
                return true
            }
            return false; // this could be smarter
        }

        function canAddSegments(adorn) {
            var node = adorn.adornedPart
            if (node.category == "Condition") {
                return true
            }
            return false; // this could be smarter
        }

        function canBeDelete(adorn) {
            var node = adorn.adornedPart
            if (node.category == "Condition" || node.category == "Action") {
                return true
            }
            return false; // this could be smarter
        }

        let deleteSelected = async (e, obj) => {
            let rst = await promiseConfirm({ title: '删除', content: `确定要删除 ”${(e.diagram.selection.first().data.text || '')}“ 节点吗？` })
            if (rst) {
                let node = e.diagram.selection.first()
                let opNode = this.opMap[node.data.key]
                if (opNode) {
                    this.opList.splice(opNode.idx, 1);
                    this.updateOpMap();
                }
                delLock = false
                e.diagram.commandHandler.deleteSelection()
                delLock = true
            }
        }

        function addCards(e, obj) {
            var data = obj.part.data
            //_t.props.onChangeProcess()
            //myDiagram.model.setDataProperty(data, "color", 'red')
            _t.refs.processSelect.showModal({
                node: data,
                data: _t.opMap[data.key] && _t.opMap[data.key].item
            })
        }

        function addSegments(e, obj) {
            let data = obj.part.data,//图上节点
                otherNodes,
                branches,
                nodeDataArray = _t.state.myDiagram.model.nodeDataArray,
                linkDataArray = _t.state.myDiagram.model.linkDataArray

            otherNodes = nodeDataArray.filter(item => item.key != data.key && item.category != "Start")
            branches = linkDataArray.filter(item => item.from == data.key)

            _t.refs.branchSelect.showModal({
                node: data,
                branches: branches,//节点出发的边
                otherNodes: otherNodes,//图上其它节点
                data: _t.opMap[data.key] && _t.opMap[data.key].item//细分数据
            })
        }

        var commandsAdornment = goObj(go.Adornment, "Horizontal",
            goObj(go.Panel, "Auto",
                goObj(go.Shape, {
                    fill: null,
                    stroke: "deepskyblue",
                    strokeWidth: 2
                }),
                goObj(go.Placeholder)
            ),
            goObj(go.Panel, "Horizontal", {
                defaultStretch: go.GraphObject.Vertical
            },
                goObj("Button",
                    goObj(go.Shape, {
                        geometryString: "M6 1 L1 1 1 9 9 9 9 3 M4 6 L10 0",
                        fill: null,
                        stroke: "black",
                        margin: 2
                    }), {
                        click: addCards,
                        toolTip: makeTooltip("添加/修改 评分卡、受信卡")
                    },
                    new go.Binding("visible", "", canAddCard).ofObject()),
                goObj("Button",
                    goObj(go.Shape, {
                        geometryString: "M6 1 L1 1 1 9 9 9 9 3 M4 6 L10 0",
                        fill: null,
                        stroke: "black",
                        margin: 2
                    }), {
                        click: addSegments,
                        toolTip: makeTooltip("添加/修改 细分")
                    },
                    new go.Binding("visible", "", canAddSegments).ofObject()),
                goObj("Button",
                    goObj(go.Shape, {
                        geometryString: "M4 0 L8 0 M0 2 L11 2F M2 4 L2 10 10 10 10 4 M4 5 L4 8 M6 5 L6 8 M8 5 L8 8",
                        fill: null,
                        margin: 2
                    }), {
                        click: deleteSelected,
                        toolTip: makeTooltip("删除节点")
                    },
                    new go.Binding("visible", "", canBeDelete).ofObject())
            )
        )

        // Define common properties and bindings for most kinds of nodes
        function nodeStyle() {
            return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                locationSpot: go.Spot.Center,
                selectionAdornmentTemplate: commandsAdornment,
                toSpot: go.Spot.Top,
                fromSpot: go.Spot.NotTopSide, // port properties on the node
                portSpreading: go.Node.SpreadingNone,
                layoutConditions: go.Part.LayoutAdded | go.Part.LayoutRemoved,
                // If a node from the pallette is dragged over this node, its outline will turn green
                mouseDragEnter: function (e, node) {
                    node.isHighlighted = true
                },
                mouseDragLeave: function (e, node) {
                    node.isHighlighted = false
                },
                // A node dropped onto this will draw a link from itself to this node
                mouseDrop: dropOntoNode
            }]
        }

        function shapeStyle() {
            return [{
                stroke: "rgb(63,63,63)",
                strokeWidth: 2
            },
            new go.Binding("stroke", "isHighlighted", function (h) {
                return h ? "chartreuse" : "rgb(63,63,63)"
            }).ofObject(),
            new go.Binding("strokeWidth", "isHighlighted", function (h) {
                return h ? 4 : 2
            }).ofObject()
            ]
        }

        function orderedDefaultName(str, obj) {
            if (str == "处理节点" || str == "分支") {
                var name = str + (parseInt(obj.part.data.key.replace(new RegExp(obj.part.category, "i"), "")) || '')
                obj.part.data.text = name
                return name
            }
            return str
        }

        // Define Node templates for various categories of nodes
        myDiagram.nodeTemplateMap.add("Start",
            // the name of the Node category
            goObj(go.Node, "Auto", {
                locationSpot: go.Spot.Center,
                deletable: false // do not allow this node to be removed by the user
            },
                new go.Binding("location", "loc", go.Point.parse),
                goObj(go.Shape, "Ellipse", {
                    fill: greenBrush,
                    strokeWidth: 2,
                    stroke: "green",
                    width: 40,
                    height: 40
                }),
                goObj(go.TextBlock, "Start")
            )
        )

        myDiagram.nodeTemplateMap.add("End",
            goObj(go.Node, "Auto", nodeStyle(), {
                deletable: false, // do not allow this node to be removed by the user
                toSpot: go.Spot.NotBottomSide // port properties on the node
            },
                goObj(go.Shape, "StopSign", shapeStyle(), {
                    fill: redBrush,
                    width: 40,
                    height: 40
                }),
                goObj(go.TextBlock, "End")
            )
        )

        myDiagram.nodeTemplateMap.add("Action",
            goObj(go.Node, "Auto", nodeStyle(), {
                fromSpot: go.Spot.Bottom
            }, // override fromSpot of nodeStyle()
                goObj(go.Shape, "Rectangle", shapeStyle(), {
                    fill: yellowBrush,
                    width: 100,
                    height: 40
                }),
                goObj(go.TextBlock, {
                    margin: 5,
                    editable: true
                },
                    // user can edit node text by clicking on it
                    new go.Binding("text", "text", orderedDefaultName).makeTwoWay())
            )
        )

        myDiagram.nodeTemplateMap.add("Condition",
            goObj(go.Node, "Spot", nodeStyle(),
                goObj(go.Panel, "Auto",
                    goObj(go.Shape, "Diamond", shapeStyle(), {
                        fill: lightBrush,
                        width: 100,
                        height: 50
                    }),
                    goObj(go.TextBlock, {
                        margin: 5,
                        editable: true
                    },
                        // user can edit node text by clicking on it
                        new go.Binding("text", "text", orderedDefaultName).makeTwoWay())
                ),
                goObj(go.Shape, "Circle", {
                    portId: "Left",
                    fromSpot: go.Spot.Left,
                    alignment: go.Spot.Left,
                    alignmentFocus: go.Spot.Left,
                    stroke: null,
                    fill: null,
                    width: 1,
                    height: 1
                }),
                goObj(go.Shape, "Circle", {
                    portId: "Right",
                    fromSpot: go.Spot.Right,
                    alignment: go.Spot.Right,
                    alignmentFocus: go.Spot.Right,
                    stroke: null,
                    fill: null,
                    width: 1,
                    height: 1
                })
            )
        )

        // Define the link template
        myDiagram.linkTemplate =
            goObj(go.Link, {
                routing: go.Link.Orthogonal,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4,
                selectable: false,
                layoutConditions: go.Part.LayoutAdded | go.Part.LayoutRemoved,
                // links cannot be selected, so they cannot be deleted
                // If a node from the Palette is dragged over this node, its outline will turn green
                mouseDragEnter: function (e, link) {
                    link.isHighlighted = true
                },
                mouseDragLeave: function (e, link) {
                    link.isHighlighted = false
                },
                // if a node from the Palette is dropped on a link, the link is replaced by links to and from the new node
                mouseDrop: dropOntoLink
            },
                goObj(go.Shape, shapeStyle()),
                goObj(go.Shape, {
                    toArrow: "standard",
                    stroke: null,
                    fill: "black"
                }),
                goObj(go.Panel, // link label for conditionals, normally not visible
                    {
                        visible: false,
                        name: "LABEL",
                        segmentIndex: 1,
                        segmentFraction: 0.5
                    },
                    new go.Binding("visible", "", function (link) {
                        return link.fromNode.category === "Condition" && !!link.data.text
                    }).ofObject(),
                    new go.Binding("segmentOffset", "side", function (s) {
                        return s === "Left" ? new go.Point(0, 14) : new go.Point(0, -14)
                    }),
                    goObj(go.TextBlock, {
                        textAlign: "center",
                        font: "10pt sans-serif",
                        margin: 2,
                        editable: false
                    },
                        new go.Binding("text").makeTwoWay())
                )
            )

        myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
            var newnode = e.diagram.selection.first()
            if (newnode.linksConnected.count === 0) {
                // when the selection is dropped but not hooked up to the rest of the graph, delete it
                delLock = false
                e.diagram.commandHandler.deleteSelection()
                delLock = true;
            }
        })


        // initialize Palette
        var myPalette =
            goObj(go.Palette, this.refs.goJsPaletteDiv, // refers to its DIV HTML element by id
                {
                    layout: goObj(go.GridLayout),
                    maxSelectionCount: 1
                })

        // define simpler templates for the Palette than in the main Diagram
        myPalette.nodeTemplateMap.add("Action",
            goObj(go.Node, "Auto",
                goObj(go.Shape, "Rectangle", {
                    fill: yellowBrush,
                    strokeWidth: 2
                }),
                goObj(go.TextBlock, {
                    margin: 5
                },
                    new go.Binding("text"))
            ))

        myPalette.nodeTemplateMap.add("Condition",
            goObj(go.Node, "Auto",
                goObj(go.Shape, "Diamond", {
                    fill: lightBrush,
                    strokeWidth: 2
                }),
                goObj(go.TextBlock, {
                    margin: 5
                },
                    new go.Binding("text"))
            ))


        // myPalette.nodeTemplateMap.add("Effect",
        //     goObj(go.Node, "Auto",
        //         goObj(go.Shape, {
        //             geometryString: "M6 1 L1 1 1 9 9 9 9 3 M4 6 L10 0",
        //             fill: null,
        //             margin:2,
        //             stroke: "black"
        //         })
        //     ))

        // add node data to the palette
        myPalette.model.nodeDataArray = [{
            key: "condition",
            category: "Condition",
            text: "分支"
        },
        {
            key: "action",
            category: "Action",
            text: "处理节点"
        }
            // ,
            // {
            //     key: "Effect",
            //     category: "Effect"
            // }
        ]

        // Graph manipulation functions, to maintain the syntax of the diagram

        function dropOntoNode(e, obj) {
            var diagram = e.diagram
            var oldnode = obj.part
            if (oldnode.category === "Start") {
                diagram.currentTool.doCancel()
                return
            }
            var newnode = diagram.selection.first()
            if (!(newnode instanceof go.Node)) return
            if (newnode.linksConnected.count > 0) {
                exciseNode(newnode)
            }

            if (newnode.category === "Effect" || newnode.category === "Action" || newnode.category === "Condition") {
                // Take all links into oldnode and relink to newnode
                var it = new go.List().addAll(oldnode.findLinksInto()).iterator
                while (it.next()) {
                    var link = it.value
                    link.toNode = newnode
                }
                // Then link newnode to oldnode
                if (newnode.category === "Condition") {
                    diagram.model.addLinkData({
                        from: newnode.data.key,
                        to: oldnode.data.key,
                        text: "",
                        segmentId: '',
                        side: "Center"
                    })
                } else {
                    diagram.model.addLinkData({
                        from: newnode.data.key,
                        to: oldnode.data.key
                    })
                }
            } else if (newnode.category === "Output") {
                // Find the previous node and add a link from it; no links coming out of an "Output"
                var prev = oldnode.findTreeParentNode()
                if (prev !== null) {
                    if (prev.category === "Condition") {
                        diagram.model.addLinkData({
                            from: prev.data.key,
                            to: newnode.data.key
                        })
                    } else {
                        diagram.model.addLinkData({
                            from: prev.data.key,
                            to: newnode.data.key
                        })
                    }
                }
            }
        }

        function dropOntoLink(e, obj) {
            var diagram = e.diagram
            var newnode = diagram.selection.first()
            if (!(newnode instanceof go.Node)) return
            if (newnode.linksConnected.count > 0) {
                exciseNode(newnode)
            }

            var oldlink = obj.part
            var fromnode = oldlink.fromNode
            var tonode = oldlink.toNode
            if (newnode.category === "Effect" || newnode.category === "Action" || newnode.category === "Condition") {
                // Reconnect the existing link to the new node
                oldlink.toNode = newnode
                // Then add links from the new node to the old node
                if (newnode.category === "Condition") {
                    diagram.model.addLinkData({
                        from: newnode.data.key,
                        to: tonode.data.key,
                        segmentId: '',
                        text: "",
                        side: "Center"
                    })
                } else {
                    diagram.model.addLinkData({
                        from: newnode.data.key,
                        to: tonode.data.key
                    })
                }
            } else if (newnode.category === "Output") {
                // Add a new link to the new node
                if (fromnode.category === "Condition") {
                    diagram.model.addLinkData({
                        from: fromnode.data.key,
                        to: newnode.data.key
                    })
                } else {
                    diagram.model.addLinkData({
                        from: fromnode.data.key,
                        to: newnode.data.key
                    })
                }
            }
        }

        // Draw links between the parent and children nodes of a node being deleted.
        function exciseNode(node) {
            if (node === null || node.category == "End") return
            var linksOut = node.findLinksOutOf()
            var to = null
            if (linksOut.count > 1) {
                to = findMerge(node)
            } else if (linksOut.count === 1) { // if only one link out of the node to be deleted
                to = linksOut.first().toNode
            }
            if (to !== null) {
                // now there is only a single output node to reconnect with
                // for all links coming into the node to be deleted
                var linksIn = new go.List().addAll(node.findLinksInto()).iterator
                while (linksIn.next()) {
                    var l = linksIn.value; // reconnect all links going into deleted node
                    l.toNode = to; // to that one destination node
                }
            } else {
                node.diagram.removeParts(node.findLinksInto(), false)
            }
        }

        // If there are multiple links going out of this node,
        // return the node where the links merge back into one node, if any.
        function findMerge(node) {
            var it = node.findLinksOutOf()
            if (it.count <= 1) return null
            node.diagram.nodes.each(function (n) {
                n._tag = 0
            })
            var i = 1
            while (it.next()) {
                var n = walkDown(it.value.toNode, i)
                if (n !== null) return n
                i++
            }
            return null
        }

        // Mark all downstream nodes, but return the first node found that was already marked
        function walkDown(node, tag) {
            var prev = node._tag
            if (prev !== 0 && prev !== tag) return node
            node._tag = tag
            if (prev === tag) return null
            var it = node.findNodesOutOf()
            while (it.next()) {
                var n = walkDown(it.value, tag)
                if (n !== null) return n
            }
            return null
        }

        // Delete a Node if there are no Links coming into it, other than the "Start" Node.
        function deleteDisconnectedNodes(diagram) {
            var nodesToDelete = diagram.nodes.filter(function (n) {
                return (n.category !== "Start" && n.category !== "End") && n.findLinksInto().count === 0
            })
            if (nodesToDelete.count > 0) {
                diagram.removeParts(nodesToDelete, false)
                deleteDisconnectedNodes(diagram)
            }
        }


        // Save a model to and load a model from JSON text, displayed below the Diagram.
        // function save() {
        //     document.getElementById("mySavedModel").value = myDiagram.model.toJson()
        //     myDiagram.isModified = false
        // }

        // function load() {
        //     myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value)
        // }

        let model = {
            "class": "go.GraphLinksModel",
            "linkFromPortIdProperty": "side",
            "nodeDataArray": [
                { "key": "Start", "category": "Start", "loc": "0 0" },
                { "key": "End", "category": "End", "loc": "0 80" }
            ],
            "linkDataArray": [
                { "from": "Start", "to": "End" }
            ]
        }

        if (this.props.defaultData) {
            let data = this.props.defaultData.data
            model.nodeDataArray = data.graphic.nodeDataArray
            this.addSideToLink(data.graphic.linkDataArray);
            model.linkDataArray = data.graphic.linkDataArray
        }

        this.setState({ myModel: model, myDiagram: myDiagram },
            () => {
                myDiagram.model = go.Model.fromJson(JSON.stringify(model))
            }
        )
    }

    addSideToLink(list) {
        list = list || [];
        let side = ['Left', 'Right'], i, k, elem, conditions = [], map = {}
        i = list.length - 1
        while (list[i]) {
            if (list[i].segmentId != undefined) {
                if (!map[list[i].from]) {
                    map[list[i].from] = [
                        list[i]
                    ];
                } else {
                    map[list[i].from].push(list[i])
                }
            }
            i--
        }
        for (let key in map) {
            conditions = map[key]
            i = 0
            k = side.length
            while (conditions[i]) {
                conditions[i].side = side[i % k]
                i++
            }
            if (conditions.length % 2 == 1) {
                conditions[0].side = 'Center'
            }
        }
    }

    constructor(props) {
        super(props)
        this.opList = []
        this.opMap = {}
        this.state = {}
        if (props.defaultData) {
            this.opList = props.defaultData.data.op
            this.updateOpMap()
        }
    }

    updateOpMap() {
        let opMap = {}
        this.opList.map((item, i) => {
            opMap[item.node] = {
                idx: i,
                item
            }
        })
        this.opMap = opMap;
    }

    componentDidMount() {
        this.renderCanvas()
    }

    getModelJson() {
        let graphic = JSON.parse(this.state.myDiagram.model.toJson()),
            op = this.opList

        delete graphic.class
        delete graphic.linkFromPortIdProperty
        return {
            graphic,
            op
        }
    }

    processChangeHandler = (e) => {
        // console.log('====================================');
        // console.log('e==', e.data);
        // console.log('====================================');
        let gnode = this.state.myDiagram.selection.first()
        let nodeKey = gnode.data.key
        let curItem = this.opMap[nodeKey]
        if (curItem) {
            this.opList.splice(curItem.idx, 1)
        }
        this.opList.push({
            node: nodeKey,
            components: [
                {
                    id: e.data.id,
                    type: e.data.data.type
                }
            ]
        })
        // console.log(this.opList)
        this.updateOpMap()
        //this.props.onChange()
    }

    branchChangeHandler = (e) => {
        let myDiagram = this.state.myDiagram,
            gnode = myDiagram.selection.first(),
            nodeKey = gnode.data.key,
            curItem = this.opMap[nodeKey]
        if (curItem) {
            this.opList.splice(curItem.idx, 1)
        }
        this.opList.push({
            node: nodeKey,
            subdivision: e.data
        })
        this.updateOpMap()

        let models = JSON.parse(myDiagram.model.toJson()),
            linkData = models.linkDataArray,
            link = [],
            i = 0,
            len = linkData.length,
            node

        // 自动修改分支名称
        // node = models.nodeDataArray.filter(item => item.key == nodeKey)
        // if (node && node.length) {
        //     node[0].text = e.data.name
        // }

        while (i < len) {
            if (linkData[i].from == nodeKey) {
                link = link.concat(linkData.splice(i, 1))
                len--
            } else {
                i++
            }
        }
        let side = ['Left', 'Right']


        let segments = e.segmentsData

        link = []
        for (let i = 0, len = segments.length; i < len; i++) {
            link.push({
                from: nodeKey,
                to: segments[i].next,
                segmentId: i,
                text: segments[i].name,
                side: side[i % side.length]
            })
        }
        if (segments.length % 2 == 1) {
            link[0].side = 'Center'
        }
        linkData = linkData.concat(link)
        models.linkDataArray = linkData
        myDiagram.model = go.Model.fromJson(JSON.stringify(models))
        //this.props.onChange()
    }

    render() {
        return <div className="go-diagram">
            <div id="myFlexDiv">
                <div id="myPODiv">
                    <div ref="goJsPaletteDiv" id="myPaletteDiv"></div>
                </div>
                <div ref="goJsDiv" id="myDiagramDiv"></div>
            </div>
            <ProcessSelect ref="processSelect" onChange={this.processChangeHandler} />
            <BranchSelect ref="branchSelect" onChange={this.branchChangeHandler} />
        </div>
    }
}