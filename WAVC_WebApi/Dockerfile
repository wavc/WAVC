FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["WAVC_WebApi/WAVC_WebApi.csproj", "WAVC_WebApi/"]
RUN dotnet restore "WAVC_WebApi/WAVC_WebApi.csproj"
COPY . .
WORKDIR "/src/WAVC_WebApi"
RUN dotnet build "WAVC_WebApi.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WAVC_WebApi.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WAVC_WebApi.dll"]