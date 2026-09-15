using System;
using System.Text.Json.Serialization;

namespace OOH.Application.Features.Global.Projects.Queries.GetProjectList
{
    public class ProjectListVM
    {
        [JsonPropertyName("projectId")]
        public string ProjectId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("startDate")]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public DateTime? EndDate { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("isVoided")]
        public bool IsVoided { get; set; }

        [JsonPropertyName("createdBy")]
        public string CreatedBy { get; set; }

        [JsonPropertyName("createdDate")]
        public DateTime? CreatedDate { get; set; }

        [JsonPropertyName("lastModifiedBy")]
        public string LastModifiedBy { get; set; }

        [JsonPropertyName("lastModifiedDate")]
        public DateTime? LastModifiedDate { get; set; }

        [JsonPropertyName("statusName")]
        public string StatusName { get; set; }

        [JsonPropertyName("isPrivate")]
        public bool IsPrivate { get; set; }
    }

    public class ProjectAuthLoginResponse
    {
        [JsonPropertyName("tokenType")]
        public string TokenType { get; set; }

        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("expiresIn")]
        public int ExpiresIn { get; set; }
    }
}
