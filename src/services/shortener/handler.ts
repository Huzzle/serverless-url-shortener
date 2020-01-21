import * as AmazonDaxClient from 'amazon-dax-client'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as shortid from 'shortid'

const DAX_ENDPOINT = process.env.DAX_ENDPOINT as string
const URLS_TABLE = process.env.URLS_TABLE as string

const getFullUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const hashCode = event.pathParameters && event.pathParameters['hashCode']

  const notFoundResponse = {
    statusCode: 404,
    body: JSON.stringify({
      error: true,
      message: 'URL not found'
    }),
  }

  if (!hashCode) {
    return notFoundResponse
  }

  const dax = new AmazonDaxClient({ endpoints: [DAX_ENDPOINT] })
  const db = new DynamoDB.DocumentClient({ service: dax })

  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: URLS_TABLE,
    Key: {
      ID: hashCode,
    }
  }

  const { Item }: DynamoDB.DocumentClient.GetItemOutput = await db.get(params).promise()

  if (!Item) {
    return notFoundResponse
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Item),
  }
}

const createShortUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { url } = JSON.parse(event.body as string)
  const dax = new AmazonDaxClient({ endpoints: [DAX_ENDPOINT] })
  const db = new DynamoDB.DocumentClient({ service: dax })
  const id = shortid.generate()

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: URLS_TABLE,
    Item: {
      ID: id,
      Url: url,
    }
  }

  await db.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({ ID: id, Url: url }),
  }
}

export {
  getFullUrl,
  createShortUrl,
}
