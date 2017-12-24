
function_name = yams

env := missing
profile := sms-dev
region := us-west-2
stage := v1

AWS_PARAMS=AWS_PROFILE=$(profile) AWS_DEFAULT_REGION=${region}
LAMBDA_PARAMS=ENV=${env} SMTP_HOST=${smtp_host} SMTP_PORT=${smtp_port} VPC_ID=${vpc_id} VPC_SUBNETS="${vpc_subnets}" VPC_SECURITY_GROUP="${vpc_sg}"

local-invoke:
	${AWS_PARAMS} ${LAMBDA_PARAMS} ./node_modules/.bin/lambda-local -t 20 -f $(function_file) -e $(event_file)

deploy:
	${AWS_PARAMS} ${LAMBDA_PARAMS} ./node_modules/.bin/serverless deploy --stage ${stage}

invoke:
	${AWS_PARAMS} ${LAMBDA_PARAMS} ./node_modules/.bin/serverless invoke --stage ${stage} -f $(function_name)

remove:
	${AWS_PARAMS} ${LAMBDA_PARAMS} ./node_modules/.bin/serverless remove --stage ${stage}
