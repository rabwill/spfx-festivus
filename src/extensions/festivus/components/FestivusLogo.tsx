import * as React from 'react';
import { IFestivusLogoProps } from './IFestivusLogoProps';
import '../festivus.css';
export class FestivusLogo extends React.Component<IFestivusLogoProps, {}> {
    constructor(props) {
        super(props);
    }
    public render(): React.ReactElement<IFestivusLogoProps> {
        let festivusStyle = {};
        switch (this.props.direction) {

            case "top-right":
                festivusStyle = {
                    left: this.props.widthval
                };
                break;
            case "bottom-right":
                festivusStyle = {
                    left: this.props.widthval,
                    top: this.props.widthval
                };
                break;
            case "bottom-left":
                festivusStyle = {
                    top: this.props.widthval
                };
                break;
            default:
                festivusStyle = {}; //top-left
        }
        return (
            <div>
                <img className="img-festivus" style={festivusStyle} src={this.props.imageUrl}></img>
            </div>
        );
    }
}
