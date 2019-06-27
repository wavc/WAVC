FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build
WORKDIR /src
COPY ["WAVC_chat3/WAVC_chat3.csproj", "WAVC_chat3/"]
RUN dotnet restore "WAVC_chat3/WAVC_chat3.csproj"
COPY . .
WORKDIR "/src/WAVC_chat3"
RUN dotnet build "WAVC_chat3.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WAVC_chat3.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WAVC_chat3.dll"]