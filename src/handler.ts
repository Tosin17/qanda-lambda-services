import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent, SNSEvent } from "aws-lambda";
import { logger } from "./logger";

const throwRandomError = () => {
  const n = Math.floor(Math.random() * 3 + 1);
  logger.info(`Random error - ${n}`);
  if (n === 2) {
    throw new Error("Something bad happend");
  }
};

export const saveGame = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    logger.info({ message: "Publishing" });
    throwRandomError();

    await new AWS.SNS()
      .publish({
        Message: "Some game saved",
        TopicArn: "arn:aws:sns:us-east-1:xxxxxxx:SavedGameTopic",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Game saved",
        },
        null,
        2
      ),
    };
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw Error(JSON.stringify(error));
  }
};

export const sendEmail = async (event: SNSEvent) => {
  logger.info("Email Sent", JSON.stringify(event.Records));
};
