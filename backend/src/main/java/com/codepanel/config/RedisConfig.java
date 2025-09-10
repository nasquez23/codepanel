package com.codepanel.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.codepanel.models.dto.ProblemPostResponse;
import com.codepanel.models.dto.AssignmentResponse;
import com.codepanel.models.dto.ProblemPostsPageSlice;
import com.codepanel.models.dto.AssignmentsPageSlice;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${spring.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.redis.port:6379}")
    private int redisPort;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        return new LettuceConnectionFactory(config);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        StringRedisSerializer keySerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer(
                objectMapperWithJavaTime());
        template.setKeySerializer(keySerializer);
        template.setHashKeySerializer(keySerializer);
        template.setValueSerializer(valueSerializer);
        template.setHashValueSerializer(valueSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        try {
            connectionFactory.getConnection().ping();

            RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10))
                    .disableCachingNullValues()
                    .serializeKeysWith(
                            RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair
                            .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapperWithJavaTime())));
            // Per-cache serializers to avoid LinkedHashMap casting
            com.fasterxml.jackson.databind.ObjectMapper mapper = objectMapperWithJavaTime();
            Jackson2JsonRedisSerializer<ProblemPostResponse> pprSerializer = new Jackson2JsonRedisSerializer<>(
                    ProblemPostResponse.class);
            pprSerializer.setObjectMapper(mapper);
            Jackson2JsonRedisSerializer<AssignmentResponse> arSerializer = new Jackson2JsonRedisSerializer<>(
                    AssignmentResponse.class);
            arSerializer.setObjectMapper(mapper);
            Jackson2JsonRedisSerializer<Long> longSerializer = new Jackson2JsonRedisSerializer<>(Long.class);
            longSerializer.setObjectMapper(mapper);

            RedisCacheConfiguration problemPostConfig = defaultConfig.serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(pprSerializer));
            RedisCacheConfiguration assignmentConfig = defaultConfig.serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(arSerializer));
            RedisCacheConfiguration notifCountConfig = defaultConfig.serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(longSerializer));
            Jackson2JsonRedisSerializer<ProblemPostsPageSlice> problemPostsSliceSerializer = new Jackson2JsonRedisSerializer<>(
                    ProblemPostsPageSlice.class);
            problemPostsSliceSerializer.setObjectMapper(mapper);
            RedisCacheConfiguration problemPostsByPageConfig = defaultConfig.serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(problemPostsSliceSerializer));
            Jackson2JsonRedisSerializer<AssignmentsPageSlice> assignmentsSliceSerializer = new Jackson2JsonRedisSerializer<>(
                    AssignmentsPageSlice.class);
            assignmentsSliceSerializer.setObjectMapper(mapper);
            RedisCacheConfiguration assignmentsByPageConfig = defaultConfig.serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(assignmentsSliceSerializer));

            java.util.Map<String, RedisCacheConfiguration> cacheConfigs = new java.util.HashMap<>();
            cacheConfigs.put("problemPostById", problemPostConfig);
            cacheConfigs.put("assignmentById", assignmentConfig);
            cacheConfigs.put("notifUnreadCount", notifCountConfig);
            cacheConfigs.put("problemPostsByPage", problemPostsByPageConfig);
            cacheConfigs.put("assignmentsByPage", assignmentsByPageConfig);

            return RedisCacheManager.builder(connectionFactory)
                    .cacheDefaults(defaultConfig)
                    .withInitialCacheConfigurations(cacheConfigs)
                    .build();
        } catch (Exception ex) {
            System.out.println("[CACHE] Redis unavailable, using in-memory cache manager. Reason: " + ex.getMessage());
            return new ConcurrentMapCacheManager();
        }
    }

    private ObjectMapper objectMapperWithJavaTime() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public CacheErrorHandler cacheErrorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, org.springframework.cache.Cache cache,
                    Object key) {
                System.out.println("[CACHE] GET error on key=" + key + ": " + exception.getMessage());
            }

            @Override
            public void handleCachePutError(RuntimeException exception, org.springframework.cache.Cache cache,
                    Object key, Object value) {
                System.out.println("[CACHE] PUT error on key=" + key + ": " + exception.getMessage());
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, org.springframework.cache.Cache cache,
                    Object key) {
                System.out.println("[CACHE] EVICT error on key=" + key + ": " + exception.getMessage());
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, org.springframework.cache.Cache cache) {
                System.out.println("[CACHE] CLEAR error: " + exception.getMessage());
            }
        };
    }
}
