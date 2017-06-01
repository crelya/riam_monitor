import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, TouchableHighlight} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";


const styles = StyleSheet.create({


});


export default class Maze extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    // componentWillReceiveProps (nextProps) {
    //     if (nextProps.maze !== this.props.maze ||  nextProps.map !== this.props.map) {
    //         this.state = {
    //             maze: nextProps.maze,
    //             map: nextProps.map
    //         }
    //     }
    // }

    renderCols(col, rows){

        var row_elems = []
        for(var j = rows - 1; j >= 0; j--){


            var position = [col, j];
            var tile = this.get_tile(position);
            var style = this.get_style(tile);

            // var map_tile = this.props.map[position[0]][position[1]]
            // console.log(map_tile)


            row_elems.push(
                <Row key={j} style={style}>
                    <Text style={{flex: 1, textAlign: 'center', color: (Object.keys(tile).length == 0 && tile.constructor == Object) ? "white" : "black"}}>{col}, {j} </Text>
                </Row>)
        }

        return row_elems;
    }


    get_style(tile){
        var style = {

            backgroundColor: '#adf7d3',
            borderColor: 'black',
            borderWidth: 2,
            alignItems: 'center'
        }

        if (Object.keys(tile).length == 0 && tile.constructor == Object){
            style.backgroundColor = "transparent"
            style.borderWidth = 0
        }else{
            if(tile.begin == "true" || tile.end == "true"){
                style.backgroundColor = "#9C5DC2"
            }else{
                style.backgroundColor = "#adf7d3"
            }


            for(var i = 0; i < tile.exits.length; i++){
                var exit = tile.exits[i];
                // console.log(exit)
                switch(exit){
                    case "NORTH":
                        style.borderTopWidth = 0;
                        break;
                    case "WEST":
                        style.borderLeftWidth = 0;
                        break;
                    case "SOUTH":
                        style.borderBottomWidth = 0;
                        break;
                    case "EAST":
                        style.borderRightWidth = 0;
                        break;
                }
            }


            if(tile.input_dir && tile.input_dir.length > 0){
                style.backgroundColor = "#7C4AB5"
            }
        }





        return style;
    }
    get_tile(position){
        var tile = null;
        for(var i = 0; i < this.props.maze.tiles.length; i++){
            tile = this.props.maze.tiles[i]
            // console.log(tile.position)
            if(tile.position[0] == position[0] && tile.position[1] == position[1]){
                // console.log("FOUND");
                return tile;
            }
        }
        return {};
    }

    buildMaze(data){
        var cols = data.cols;
        var rows = data.rows;

        var grid_elems = [];
        for(var i = data.startX; i < (cols + data.startX); i++){
            grid_elems.push(<Col key={i} style={{backgroundColor: 'white'}}>{this.renderCols(i, rows)}</Col>)
        }
        return grid_elems;
    }


    render() {

        return (
            <Grid>
                {this.buildMaze(this.props.maze)}
            </Grid>


        );
    }
}
