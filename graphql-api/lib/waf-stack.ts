import {Stack, StackProps} from "aws-cdk-lib";
import {CfnWebACL, CfnWebACLAssociation} from "aws-cdk-lib/aws-wafv2";
import {Construct} from "constructs";

interface Props {
  apiArn: string;
}

// Creates AWS WAF, with Web ACL and rules.
export class WafStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webAcl = new CfnWebACL(this, "web-acl", {
      defaultAction: {
        allow: {}
      },
      scope: "REGIONAL",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: "webACL",
        sampledRequestsEnabled: true
      },
      rules: [
        {
          name: "AWS-AWSManagedRulesCommonRuleSet",
          priority: 1,
          overrideAction: {none: {}},
          statement: {
            managedRuleGroupStatement: {
              name: "AWSManagedRulesCommonRuleSet",
              vendorName: "AWS",
              excludedRules: [{name: "SizeRestrictions_BODY"}]
            }
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "awsCommonRules",
            sampledRequestsEnabled: true
          }
        },
      ]
    });
    new CfnWebACLAssociation(this, "web-acl-association", {
      webAclArn: webAcl.attrArn,
      resourceArn: (props as Props).apiArn
    });
  }

}
