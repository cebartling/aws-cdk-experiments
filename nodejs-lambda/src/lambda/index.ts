import { APIGatewayEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

const tracer = new Tracer();
const logger = new Logger();

export const handler: Handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.info('This is an INFO log - sending HTTP 200 - hello world response');
  let response: APIGatewayProxyResult = {
    statusCode: 422,
    body: JSON.stringify({}),
  };
  // Get facade segment created by Lambda
  const segment = tracer.getSegment();

  if (segment) {
    // Create subsegment for the function and set it as active
    const handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
    tracer.setSegment(handlerSegment);

    // Annotate the subsegment with the cold start and serviceName
    tracer.annotateColdStart();
    tracer.addServiceNameAnnotation();

    // Add annotation for the awsRequestId
    tracer.putAnnotation('awsRequestId', context.awsRequestId);
    // Create another subsegment and set it as active
    const subsegment = handlerSegment.addNewSubsegment('### MySubSegment');
    tracer.setSegment(subsegment);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
      }),
    };
    // Close subsegments (the Lambda one is closed automatically)
    subsegment.close(); // (### MySubSegment)
    handlerSegment.close(); // (## index.handler)

    // Set the facade segment as active again (the one created by Lambda)
    tracer.setSegment(segment);
  }
  return response;
};
