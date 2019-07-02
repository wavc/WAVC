FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["WAVC/WAVC.csproj", "WAVC/"]
RUN dotnet restore "WAVC/WAVC.csproj"
COPY . .
WORKDIR "/src/WAVC"
RUN dotnet build "WAVC.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WAVC.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WAVC.dll"]