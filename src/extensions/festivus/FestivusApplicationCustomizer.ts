import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { IFestivusLogoProps } from './components/IFestivusLogoProps';
import { FestivusLogo } from './components/FestivusLogo';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as $ from 'jquery';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';
const LOG_SOURCE: string = 'FestivusApplicationCustomizer';
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFestivusApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class FestivusApplicationCustomizer
  extends BaseApplicationCustomizer<IFestivusApplicationCustomizerProperties> {
  private _retryCount = 0;
  private _topPlaceholder: PlaceholderContent | undefined;
  constructor() {
    super();
    this._addFestivusContents = this._addFestivusContents.bind(this);
  }
  @override
  public onInit(): Promise<void> {
    this.context.application.navigatedEvent.add(this, () => this._addFestivusContents());
    return;
  }
  private _onDispose(): void {
    /*
    Placeholder for dispose
    */
  }
  private _addFestivusContents = () => {

    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });
    }
    if (this._topPlaceholder.domElement) {
      /* find the element for main div in the logo wrapper
      */
      const logoElement: any = $("div[class^='logoCell']");
      /*wait until logo wrapper is rendered
      */
      if (!logoElement) {
        if (this._retryCount < 50) {
          this._retryCount++;
          window.setTimeout(this._addFestivusContents, 3000);
        }
      } else {
        /* get active festival list item from list Festivus
        */
        const headers: Headers = new Headers();
        headers.append('accept', 'application/json;odata.metadata=none');
        this.context.spHttpClient
          .get(`${this.context.pageContext.web.absoluteUrl}/_api/getlistByTitle('Festivus')/items?$select=Active,Direction,FestiveImage&filter=Active eq 1`, SPHttpClient.configurations.v1, {
            headers: headers
          })
          .then((res: SPHttpClientResponse): Promise<{ value: any[] }> => {
            return res.json();
          },rejected=>{
            Log.info(LOG_SOURCE,`Error at retrieving the list item for Festivus:404`);
          })
          .then((res: { value: any[] }): void => {
            if (res.value) {
              const festiveItem: any = res.value.map(fest => {
                return {
                  direction: fest.Direction,
                  imgUrl: fest.FestiveImage.Url,
                  active: fest.Active
                };
              });
              var logoCellWidth = (logoElement.width()) ? parseFloat(logoElement.width()) : 0;
              const element: React.ReactElement<IFestivusLogoProps> = React.createElement(
                FestivusLogo,
                {
                  imageUrl: festiveItem[0]["imgUrl"],
                  widthval: logoCellWidth,
                  direction: festiveItem[0]["direction"]
                }
              );
              // render the Festivus logo decoration using a React component
              ReactDom.render(element, this._topPlaceholder.domElement);
            }
          },rejected=>{
            Log.info(LOG_SOURCE,`Error at retrieving the value from Festivus response`);
          });
      }
    }
  }
}

