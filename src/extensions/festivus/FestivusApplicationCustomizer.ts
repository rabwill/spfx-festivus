import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'FestivusApplicationCustomizerStrings';
import * as $ from 'jquery';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import './festivus.css';
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
  private _direction=[
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left"];

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
      const logoElement = $("div[class^='logoCell-']");

      /*wait until it is rendered
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
         .get(`${this.context.pageContext.web.absoluteUrl}/_api/lists('260ddb11-8504-47ce-874c-6dab0c2be7bd')/items?$select=Active,Direction,FestiveImage&filter=FestiveActive eq 0`, SPHttpClient.configurations.v1, {
           headers: headers
         })
         .then((res: SPHttpClientResponse): Promise<{ value: any[] }> => {
          return res.json();
        })
        .then((res: { value: any[] }): void => {
          const festiveItem: any = res.value.map(fest => {
            return {
              direction: fest.Direction,
              imgUrl: fest.FestiveImage.Url,
              active:fest.Active
            };
          });
          console.log(festiveItem);
           const imageElement=`<img class="img-festivus ${festiveItem[0]["direction"]}" src="${festiveItem[0]["imgUrl"]}">`;
          $("div[class^='img-festivus']").length===0?
          logoElement.append(imageElement)
          :console.log('already rendered');
         });
       
      }
    }
  }
}

