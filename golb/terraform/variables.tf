variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "db_username" {
  type = string
}
variable "db_password" {
  type = string
  sensitive = true
}
