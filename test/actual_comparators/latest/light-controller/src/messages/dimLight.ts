

    
    
import { default as DimLightPayloadserereSchema } from '../schema/DimLightPayloadserere';

    
    
import { default as ResponseSchema } from '../schema/Response';


export default class DimLight {
  
    
    
  dimLightPayloadserere:DimLightPayloadserereSchema;

    
    
  response:ResponseSchema;


  constructor(
    dimLightPayloadserere: DimLightPayloadserereSchema,response: ResponseSchema
  ){
  
    
    
    this.dimLightPayloadserere = dimLightPayloadserere;

    
    
    this.response = response;

  }

  /**
   * Parses a JSON string to an object of DimLight message class.
   * @param json string to be parsed as DimLight.
   */
  public static toMessage(json: string): DimLight {
    return JSON.parse(json);
  }

}
