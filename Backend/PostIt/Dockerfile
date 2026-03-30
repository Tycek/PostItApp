FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["PostIt.csproj", "."]
RUN dotnet restore "./PostIt.csproj"
COPY . .
RUN dotnet build "PostIt.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PostIt.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "PostIt.dll"]
